// import OrderForm from "src/models/order_form";
// import Order from "src/models/order";
const OrderForm = function() {}
const Order = function() {}

const { RoutableState } = statechart;

export default new RoutableState('dialog', function() {
  this.C(function(arg) {
    var campaignDialog = arg && arg.campaignDialog;
    if (this.resolve(campaignDialog)) {
      return campaignDialog;
    }
    else {
      return null;
    }
  });

  this.state('none', function() {
    this.enter(function() {
      this.params({ campaignDialog: undefined });
      CMM.appState.campaignDialog = undefined;
    });

    this.event('showEditMediaPlan', () => this.goto('../editMediaPlan'));

    this.event('openRfpDialog', function() {
      this.goto('../sendRfp');
    });

    this.event('initiateTraffic', function(adServer) {
      this.goto('../trafficMediaPlan', { context: { adServer }, force: true });
    });

    this.event('openProposalDialog', function() {
      this.goto('../sendProposal');
    });

    this.event('openProposalUpdateDialog', function(buy) {
      this.goto('../sendProposalUpdate', {
        context: { buyId: buy.id }
      });
    });

    this.event('openInsertionOrderDialog', function() {
      this.goto('../sendInsertionOrder');
    });

    this.event('openAcceptRejectInsertionOrderDialog', function(order) {
      this.goto('../acceptRejectInsertionOrder', {
        context: { orderId: order.id }
      });
    });
  });

  this.state('editMediaPlan', function() {
    this.enter(function() {
      this.params({ campaignDialog: this.name });
      CMM.appState.campaignDialog = this.name;
    });

    this.event('hideEditMediaPlan', () => this.goto('../none'));
  });

  this.state('trafficMediaPlan', function() {
    this.enter(function(ctx) {
      var campaign = CMM.appState.campaign;

      campaign.then(function() {
        this.params({ campaignDialog: this.name, adServer: ctx.adServer });

        CMM.appState.isInExportState = true;
        CMM.appState.adServer = ctx.adServer;

        CMM.appState.campaign.getTrafficSummary().then(function() {
          var trafficData = CMM.appState.campaign.trafficSummaryFor(CMM.appState.adServer);
          CMM.appState.campaignDialog = this.name;
          CMM.appState.trafficData = trafficData;

          if (trafficData.profile) {
            CMM.appState.profile = trafficData.profile;
          }

          // FIXME: start polling for traffic status here if an existing export is currently
          // in progress - this will be necessary for traffic status to be visible between
          // users
        }.bind(this));
      }.bind(this));
    });

    this.exit(function() {
      this.params({ campaignDialog: undefined, adServer: undefined });

      CMM.appState.isInExportState = false;
      CMM.appState.adServer = undefined;
      CMM.appState.trafficData = undefined;
      CMM.appState.campaignDialog = undefined;
      CMM.appState.profile = undefined;
      CMM.appState.newAccount = undefined;
    });

    this.event('setProfile', function(profile) {
      CMM.appState.trafficData.profile = profile;
      CMM.appState.profile = profile;
    });

    this.event('createSizmekAccount', function(adServerName) {
      CMM.appState.newAccount = new CMM.Account({ adserver:adServerName });
      CMM.appState.campaignDialog = 'showSizmekLoginDialog';
    });

    this.event('traffic', function() {
      var lpName = CMM.appState.trafficData.landingPageName;
      var lpUrl = CMM.appState.trafficData.landingPageUrl;
      var profileId = CMM.appState.profile && CMM.appState.profile.id;
      var adServer = CMM.appState.adServer;

      CMM.appState.campaign.save({
        type: 'traffic',
        landingPageName: lpName,
        landingPageUrl: lpUrl,
        profileId: profileId,
        mediaPlanId: CMM.appState.selectedMediaPlan.id,
        adServerPluginName: adServer
      }).then(function() {
        var campaign = CMM.appState.campaign;
        var mediaPlan = CMM.appState.selectedMediaPlan;
        var initiative = campaign.initiative;
        let url = `/campaigns/${campaign.id}?mode=planning&mediaPlanId=${mediaPlan.id}&campaignDialog=trafficMediaPlan&adServer=${adServer}`;

        CMM.analytics.track('trafficCampaignStarted', {
          campaignName: campaign.name,
          campaignId: campaign.id,
          initiativeId: initiative.id,
          daysAfterStartOfCampaign: moment().diff(campaign.startDate, 'days')
        });

        CMM.flash.confirm("Exporting placements to " + CMM.Vendor.adServerName(adServer));

        CMM.appState.campaign.pollTrafficStatusFor(adServer).then(function() {
          var trafficData = campaign.trafficSummaryFor(adServer);

          // refresh the campaign
          campaign.get();

          if (trafficData.isSuccessful) {
            CMM.flash.confirm(`${campaign.name} campaign successfully exported to ${CMM.Vendor.adServerName(adServer)}.`);

            CMM.analytics.track('trafficExportSucceeded', {
              campaignName: campaign.name,
              campaignId: campaign.id,
              initiativeId: campaign.initiative.id
            });
          }
          else if (trafficData.isPartialSuccess) {
            CMM.flash.alert(`${campaign.name} campaign partially exported to ${CMM.Vendor.adServerName(adServer)}. Some placements failed to export. <a href="${url}" class="Flash-link">View details</a>.`, { html: true });

            CMM.analytics.track('trafficExportPartialSuccess', {
              campaignName: campaign.name,
              campaignId: campaign.id,
              initiativeId: campaign.initiative.id
            });
          }
          else if (trafficData.isTotalFailure) {
            CMM.flash.alert(`${campaign.name} campaign failed to export to ${CMM.Vendor.adServerName(adServer)}. <a href="${url}" class="Flash-link">View details</a>.`, { html: true });

            CMM.analytics.track('trafficExportFailed', {
              campaignName: campaign.name,
              campaignId: campaign.id,
              initiativeId: campaign.initiative.id
            });
          }
        });
      }).catch(function() {
        CMM.flash.alert("Something went wrong starting " + CMM.Vendor.adServerName(adServer) + " trafficking.");
      });
    });

    this.event('dismissTraffic', function() {
      this.goto('../none');
    });
  });

  this.state('sendRfp', function() {

    this.enter(function() {
      this.params({ campaignDialog: this.name });
      CMM.appState.campaign.then(() => {
        CMM.appState.campaignProposals.then(() => {
          Promise.all(
            [...(CMM.appState.campaign.buys
              .filter(buy => buy.getPath('workingCopyProposals.length'))
              .map(buy => buy.loadContacts())
            )]
          ).then(() => {
            CMM.appState.rfp = new CMM.Rfp({
              campaign: CMM.appState.campaign
            });
            CMM.appState.rfp._clearChanges();
            CMM.appState.campaignDialog = this.name;
          });
        });
      });
    });

    this.exit(function() {
      CMM.appState.rfp = undefined;
    });

    this.event('cancelRfpCreate', function() {
      var _this = this;
      var ignoreConfirmation = CMM.appState.rfp.hasErrors || !CMM.appState.rfp.hasChanges;
      if (ignoreConfirmation) {
        _this.goto('../none');
      }
      else {
        CMM.confirm({
          headerText: 'Are you sure?',
          bodyHTML: "<p>If you cancel this RFP, you'll lose your changes and will not be able to recover them.</p>",
          confirmText: "Discard changes and cancel RFP",
          cancelText: 'Continue editing',
          onConfirm: function() {
            _this.goto('../none');
          }
        });
      }
    });

    this.event('saveRfp', function() {
      CMM.appState.rfp.validate();

      if (!CMM.appState.rfp.hasErrors) {
        CMM.appState.rfp.save().then(function() {
          CMM.flash.confirm("RFP sent.");
          CMM.statechart.send('rfpSent');

          var campaign = CMM.appState.campaign;
          var initiative = campaign.initiative;
          var mediaPlan = CMM.appState.selectedMediaPlan;

          CMM.analytics.track('rfpSent', {
            campaignName: campaign.name,
            campaignId: campaign.id,
            initiativeId: initiative.id,
            clientCost: mediaPlan.clientCost,
            mediaCost: mediaPlan.totalCost,
          });
        });
        this.goto('../none');
      }
    });
  });

  this.state('sendProposal', function() {

    this.enter(function() {
      this.params({ campaignDialog: this.name });

      CMM.appState.campaignDialog = this.name;
      CMM.appState.campaign.then(function() {
        const mediaPlan = CMM.appState.selectedMediaPlan;
        CMM.appState.sendProposal = new CMM.SendProposal({
          buy: CMM.appState.campaign.buys.first,
          mediaPlans: mediaPlan.isEditable ? [mediaPlan] : []
        });
      });
    });

    this.exit(function() {
      CMM.appState.sendProposal = undefined;
    });

    this.event('cancelSendProposal', function() {
      var _this = this;
      if (CMM.appState.sendProposal.hasChanges) {
        CMM.confirm({
          headerText: 'Are you sure?',
          bodyHTML: "<p>If you cancel this proposal, you'll lose your changes and will not be able to recover them.</p>",
          confirmText: "Discard changes and cancel proposal",
          cancelText: 'Continue editing',
          onConfirm: function() {
            _this.goto('../none');
          }
        });
      }
      else {
        this.goto('../none');
      }
    });

    this.event('saveSendProposal', function() {
      CMM.appState.sendProposal.validate();

      if (!CMM.appState.sendProposal.hasErrors) {
        CMM.appState.sendProposal.save();
        CMM.flash.confirm("Proposal sent.");

        var mediaPlan = CMM.appState.selectedMediaPlan;
        var campaign = mediaPlan.campaign;

        CMM.analytics.track('proposalSent', {
          campaignName: campaign.name,
          campaignId: campaign.id,
          totalCost: mediaPlan.totalCost,
        });
        this.goto('../none');
      }
    });
  });

  this.state('sendProposalUpdate', function() {
    this.enter(function(arg) {
      var buyId = arg.buyId;
      this.params({
        campaignDialog: this.name,
        buyId: buyId
      });
      CMM.appState.campaign.then(() => {
        var buys = CMM.appState.campaign.buys;
        var mediaPlan = CMM.appState.selectedMediaPlan;
        var currentBuy = buys.find(function(buy) {
          return buy.id === buyId;
        }) || buys.first;

        currentBuy.loadContacts().then(() => {
          CMM.appState.campaignDialog = this.name;
          CMM.appState.sendProposalUpdate = new CMM.SendProposalUpdate({
            mediaPlans: mediaPlan.isEditable ? [mediaPlan] : [],
            buy: currentBuy,
            contacts: currentBuy.contacts
          });
        });
      });
    });

    this.exit(function() {
      CMM.appState.sendProposalUpdate = undefined;
      this.params({ buyId: false });
    });

    this.event('cancelSendProposalUpdate', function() {
      if (CMM.appState.sendProposalUpdate.hasChanges) {
        var _this = this;
        CMM.confirm({
          headerText: 'Are you sure?',
          bodyHTML: "<p>If you cancel this proposal, you'll lose your changes and will not be able to recover them.</p>",
          confirmText: "Discard changes and cancel proposal",
          cancelText: 'Continue editing',
          onConfirm: function() {
            _this.goto('../none');
          }
        });
      }
      else {
        this.goto('../none');
      }
    });
    this.event('saveSendProposalUpdate', function() {
      if (CMM.appState.sendProposalUpdate.validate()) {
        CMM.appState.sendProposalUpdate.save().then(() =>
          CMM.statechart.send('proposalUpdateSent')
        );
        CMM.flash.confirm("Proposal sent.");
        this.goto('../none');
      }
    });
  });

  this.state('sendInsertionOrder', function() {

    this.enter(function() {
      this.params({ campaignDialog: this.name });
      CMM.appState.orderForm = OrderForm.get(CMM.appState.campaign.id, { refresh: true });
      CMM.appState.campaignDialog = this.name;
    });

    this.exit(function() {
      CMM.appState.orderForm = undefined;
    });

    this.state('create', function() {

      this.enter(function() {
        CMM.appState.orderForm.page = this.name;

        CMM.appState.orderForm.then(() => {
          if (!CMM.appState.orderForm.allVendorsHaveTermsAndConditions) {
            CMM.flash.alert('Terms & Conditions are needed for your Agency. Contact your Admin to create Terms & Conditions', {
              dismissible: false
            });
          }
        });
      });

      this.event('previewInsertionOrder', function() {
        this.goto('../preview');
      });

      this.event('cancelSendInsertionOrder', function() {
        var _this = this;
        CMM.confirm({
          headerText: "Are you sure?",
          bodyHTML: "<p>If you cancel this IO, you'll lose your changes and will not be able to recover them.</p>",
          confirmText: "Discard changes and cancel IO",
          cancelText: 'Continue editing',
          onConfirm: function() {
            _this.goto('../../none');
          }
        });
      });

      this.exit(function() {
        CMM.flash.dismiss();
      });
    });

    this.state('preview', function() {
      this.enter(function() {
        CMM.appState.orderForm.page = this.name;
      });

      this.event('goBackToCreateInsertionOrder', function() {
        this.goto('../create');
      });

      this.event('saveInsertionOrder', function() {
        if (CMM.appState.orderForm.validate()) {
          const campaignId = CMM.appState.campaign.id;
          const campaignName = CMM.appState.campaign.name;
          const mediaPlanId = CMM.appState.selectedMediaPlan.id;
          const buyIds = CMM.appState.orderForm.selectedBuysWithRecipients.map(buy => buy.id);

          CMM.appState.orderForm.createOrders().then(() => {
            CMM.flash.confirm("Insertion Order sent.");
            CMM.statechart.send('insertionOrderSent');
            CMM.analytics.track('IOIssued', { campaignId, campaignName, mediaPlanId });
            buyIds.forEach((buyId) => CMM.NegotiationMessage.query({ buyId }));
            this.goto('../../none');
          });
        }
        else {
          // NOTE: The message refers to just dueDate but we'll drop in here
          // for any orderForm validation issue - only dueDate can become invalid
          // While in the preview view, others are handled on initial create screen.
          CMM.flash.alert(`Due date must be in the future`);
          this.goto('../create');
        }
      });
    });
  });

  this.state('acceptRejectInsertionOrder', function() {

    this.exit(function() {
      CMM.appState.order = undefined;
    });

    this.state('acceptReject', function() {

      this.enter(function({ orderId }) {
        CMM.appState.campaign.then(function() {
          const order = CMM.appState.order = Order.local(orderId);
          CMM.statechart.send('showPrintPreview', {
            header: React.createElement(CMM.IOPrintPreviewHeader, { order }),
            body: React.createElement(CMM.IOPrintPreviewBody, {
              order, allowEditingPayee: order.isPending
            }),
            footer: order.isPending && React.createElement(CMM.IOPrintPreviewAcceptRejectFooter, {
              order
            })
          });
        });
      });

      this.exit(function() {
        window.setTimeout(function() {
          CMM.statechart.send('hidePrintPreview');
        });
      });

      this.event('hidePrintPreview', function() {
        this.goto('../../none');
      });

      this.event('rejectInsertionOrder', function() {
        var campaign = CMM.appState.campaign;
        var initiative = campaign.initiative;
        CMM.analytics.track('IORejected', {
          campaignName: campaign.name,
          campaignId: campaign.id,
          initiativeId: initiative.id,
          revised: CMM.appState.order.revised
        });
        this.goto('../rejectInsertionOrder');
      });

      this.event('acceptInsertionOrder', function() {
        if (CMM.appState.order.validate()) {
          CMM.appState.campaign.save({ type: 'approve_order', order: CMM.appState.order }).then(() => {
            CMM.flash.confirm('Insertion Order accepted.');
            var campaign = CMM.appState.campaign;
            var initiative = campaign.initiative;
            CMM.analytics.track('IOAccepted', {
              campaignName: campaign.name,
              campaignId: campaign.id,
              initiativeId: initiative.id,
              revised: CMM.appState.order.revised
            });
            CMM.statechart.send('mediaPlanSelected', CMM.appState.campaign.currentVendorApprovedPlan);
            this.goto('../../none');
          });
        }
      });
    });

    this.state('rejectInsertionOrder', function() {
      this.enter(function() {
        CMM.appState.order.reject();
        CMM.appState.campaignDialog = this.name;
      });

      this.event('goBackToAcceptRejectInsertionOrder', function() {
        CMM.appState.order.undoReject();
        this.goto('../acceptReject', { context:{ orderId: CMM.appState.order.id } });
      });

      this.event('sendInsertionOrderRejection', function() {
        if (CMM.appState.order.validate()) {
          CMM.appState.order.save({ reject: true }).then(() => {
            CMM.MediaPlan.query({ buy_id: CMM.appState.getPath('campaign.buys.first.id') });
            CMM.flash.confirm("Insertion Order rejected.");
            this.goto('../../none');
          });
        }
      });
    });
  });
});
