window.stateObj = {
  "name": "enter a global state variable",
  "concurrent": false,
  "events": [],
  "children": []
}
||
{
  "name": "globalSearch",
  "concurrent": false,
  "events": [],
  "children": [
    {
      "name": "off",
      "concurrent": false,
      "events": [
        {
          "name": "toggleGlobalSearch",
          "func": "function () {\n      this.goto('../on');\n    }"
        },
        {
          "name": "showProperty",
          "func": "function (propertyId) {\n      this.goto('../on/resultModal/property/show', {\n        context: {\n          property: propertyId\n        }\n      });\n    }"
        },
        {
          "name": "showVendor",
          "func": "function (vendorId) {\n      this.goto('../on/resultModal/vendor/show', {\n        context: {\n          vendor: vendorId\n        }\n      });\n    }"
        }
      ],
      "children": null
    },
    {
      "name": "on",
      "concurrent": true,
      "events": [],
      "children": [
        {
          "name": "search",
          "concurrent": false,
          "events": [
            {
              "name": "toggleGlobalSearch",
              "func": "function () {\n        if (!CMM.utils.userCan('manageGlobalDirectory', 'frontend')) {\n          this.goto('../../off');\n        }\n      }"
            },
            {
              "name": "redoGlobalSearch",
              "func": "function () {\n        var _this = this;\n        window.setTimeout(function () {\n          _this.goto('.', {\n            force: true\n          });\n        });\n      }"
            },
            {
              "name": "searchQueryChanged",
              "func": "function () {\n        var searchQuery = CMM.appState.searchQuery;\n        var _this = this;\n\n        window.setTimeout(function () {\n          _this.params({\n            search: searchQuery.query,\n            searchType: searchQuery.type\n          });\n        });\n\n        searchQuery.page = 1;\n        CMM.appState.searchResults.query({ searchQuery: searchQuery });\n\n        CMM.analytics.track('directorySearched', {\n          'query': searchQuery.query\n        });\n      }"
            },
            {
              "name": "loadMoreSearchResults",
              "func": "function () {\n        var searchQuery = CMM.appState.searchQuery;\n        searchQuery.page = (searchQuery.page || 1) + 1;\n\n        var nextPage = CMM.SearchResult.query({ searchQuery: searchQuery });\n        nextPage.then(function () {\n          var searchResults = CMM.appState.searchResults;\n          searchResults.push.apply(searchResults, nextPage);\n          CMM.appState.searchResults.meta = nextPage.meta;\n        });\n      }"
            },
            {
              "name": "addVendorToPlan",
              "func": "function (vendorid) {\n        CMM.appState.selectedMediaPlan.add(vendorid);\n      }"
            }
          ],
          "children": null
        },
        {
          "name": "addPropertyToPlan",
          "concurrent": false,
          "events": [],
          "children": [
            {
              "name": "off",
              "concurrent": false,
              "events": [
                {
                  "name": "addToPlan",
                  "func": "function (propertyId) {\n          var _this2 = this;\n\n          var propertyModel = CMM.Property.get(propertyId, {\n            refresh: true\n          });\n          propertyModel.then(function () {\n            var campaign = CMM.appState.campaign;\n\n            if (CMM.seeds.currentUser.isVendorUser) {\n              var vendor = campaign.buys.first.vendor;\n              CMM.appState.selectedMediaPlan.add(vendor.id, vendor.propertyVendors.find(function (pv) {\n                return pv.property === propertyModel;\n              }).id, []);\n            } else {\n              if (propertyModel.activePropertyVendors.length > 1) {\n                _this2.goto('../on', {\n                  context: {\n                    property: propertyId\n                  }\n                });\n              } else if (propertyModel.activePropertyVendors.length === 1) {\n                _this2.goto('../on/chooseContactModal', {\n                  context: {\n                    property: propertyId,\n                    propertyVendor: propertyModel.activePropertyVendors[0].id,\n                    vendor: propertyModel.activePropertyVendors[0].vendor.id\n                  }\n                });\n              } else {\n                CMM.flash.alert(\"This property has been deactivated\");\n              }\n            }\n          });\n        }"
                }
              ],
              "children": null
            },
            {
              "name": "on",
              "concurrent": false,
              "events": [
                {
                  "name": "closeAddPropertyModal",
                  "func": "function () {\n          this.goto('../off');\n        }"
                },
                {
                  "name": "showProperty",
                  "func": "function (propertyId, tab) {\n          navigationHistory.unshift({\n            event: 'showProperty',\n            args: [propertyId, tab, /* viewOnly */true]\n          });\n        }"
                },
                {
                  "name": "showVendor",
                  "func": "function (vendorId, tab) {\n          navigationHistory.unshift({\n            event: 'showVendor',\n            args: [vendorId, tab, /* editMode */false, /* viewOnly */true]\n          });\n        }"
                },
                {
                  "name": "showVendorContact",
                  "func": "function (contactId, viewOnly, vendorId) {\n          navigationHistory.unshift({\n            event: 'showVendorContact',\n            args: [contactId, /* viewOnly */true, /* venderId */vendorId]\n          });\n        }"
                },
                {
                  "name": "selectTab",
                  "func": "function (tab) {\n          var currentItem = navigationHistory[0];\n          // Update the latest history so the user backs into the same tab they\n          // left\n          if (currentItem && (currentItem.event === 'showVendor' || currentItem.event === 'showProperty')) {\n            currentItem.args[1] = tab;\n          }\n        }"
                },
                {
                  "name": "openChooseVendorModal",
                  "func": "function (property, selectedPropertyVendor) {\n          this.goto('chooseVendorModal', {\n            context: {\n              property: property,\n              selectedPropertyVendor: selectedPropertyVendor\n            }\n          });\n        }"
                },
                {
                  "name": "goBack",
                  "func": "function () {\n          navigationHistory.shift();\n          if (navigationHistory && navigationHistory.length) {\n            var _CMM$statechart;\n\n            var _navigationHistory$sh = navigationHistory.shift();\n\n            var event = _navigationHistory$sh.event;\n            var args = _navigationHistory$sh.args;\n\n            (_CMM$statechart = CMM.statechart).send.apply(_CMM$statechart, [event].concat(_toConsumableArray(args)));\n          } else {\n            // Reenter child state to refresh all data\n            var _substateMap = this.substateMap;\n            var chooseContactModal = _substateMap.chooseContactModal;\n            var chooseVendorModal = _substateMap.chooseVendorModal;\n\n            var targetChildState = void 0;\n            if (chooseContactModal.isCurrent('.')) {\n              targetChildState = chooseContactModal;\n            } else {\n              if (chooseVendorModal.isCurrent('.')) {\n                targetChildState = chooseVendorModal;\n              } else {\n                targetChildState = null;\n              }\n            }\n\n            if (targetChildState) {\n              targetChildState.goto('.', {\n                force: true,\n                context: {\n                  property: CMM.appState.addPropertyModel.id,\n                  propertyVendor: CMM.appState.contactsForPropertyVendorId,\n                  vendor: CMM.appState.contactsFor && CMM.appState.contactsFor.id\n                }\n              });\n              CMM.statechart.send('closeGlobalSearchModal');\n            }\n          }\n        }"
                }
              ],
              "children": [
                {
                  "name": "chooseVendorModal",
                  "concurrent": false,
                  "events": [
                    {
                      "name": "openChooseContactModal",
                      "func": "function (propertyVendor) {\n            navigationHistory.unshift({\n              event: 'openChooseVendorModal',\n              args: [propertyVendor.property.id, propertyVendor]\n            });\n            navigationHistory.unshift({\n              event: 'openChooseContactModal',\n              args: [propertyVendor]\n            });\n\n            this.goto('../chooseContactModal', {\n              context: {\n                propertyVendor: propertyVendor.id,\n                vendor: propertyVendor.vendor.id\n              }\n            });\n          }"
                    }
                  ],
                  "children": null
                },
                {
                  "name": "chooseContactModal",
                  "concurrent": false,
                  "events": [
                    {
                      "name": "chooseContactModalGoBack",
                      "func": "function () {\n            CMM.statechart.send('goBack');\n          }"
                    },
                    {
                      "name": "closeChooseContactModal",
                      "func": "function () {\n            this.goto('../../off');\n          }"
                    },
                    {
                      "name": "addPropertyVendorToPlan",
                      "func": "function (selectedContacts) {\n            CMM.appState.selectedMediaPlan.add(CMM.appState.contactsFor.id, CMM.appState.contactsForPropertyVendorId, selectedContacts).catch(function () {\n              CMM.flash.alert('Could not add property or vendor to plan');\n            });\n            this.goto('../../off');\n          }"
                    }
                  ],
                  "children": [
                    {
                      "name": "contactList",
                      "concurrent": false,
                      "events": [
                        {
                          "name": "addNewContact",
                          "func": "function (contactType) {\n              CMM.statechart.send('searchVendorContact', {\n                vendor: CMM.appState.contactsFor.id,\n                editMode: false,\n                viewOnly: false\n              });\n            }"
                        },
                        {
                          "name": "successfullyAssociatedContact",
                          "func": "function () {\n              CMM.appState.contacts = CMM.Contact.query({\n                propertyVendorId: CMM.appState.contactsForPropertyVendorId\n              });\n            }"
                        },
                        {
                          "name": "successfullyCreatedContact",
                          "func": "function () {\n              CMM.appState.contacts = CMM.Contact.query({\n                propertyVendorId: CMM.appState.contactsForPropertyVendorId\n              });\n            }"
                        }
                      ],
                      "children": null
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "name": "deactivate",
          "concurrent": false,
          "events": [],
          "children": [
            {
              "name": "off",
              "concurrent": false,
              "events": [
                {
                  "name": "showDeactivateModal",
                  "func": "function (model) {\n      this.goto('../on', { context: { model: model } });\n    }"
                }
              ],
              "children": null
            },
            {
              "name": "on",
              "concurrent": false,
              "events": [
                {
                  "name": "deactivationSuccess",
                  "func": "function (model) {\n      var isProperty = model instanceof CMM.Property;\n      var isVendor = model instanceof CMM.Vendor;\n      var isPropertyVendor = model instanceof CMM.PropertyVendor;\n\n      CMM.flash.confirm((isProperty ? 'Property' : 'Vendor') + ' deactivated.');\n      if (isProperty) {\n        CMM.flash.confirm('Property deactivated.');\n      } else if (isVendor) {\n        CMM.flash.confirm('Vendor deactivated.');\n      } else if (isPropertyVendor) {\n        CMM.flash.confirm('Property removed from vendor');\n      }\n\n      this.goto('../off');\n\n      if (isProperty) {\n        CMM.statechart.send('showProperty', model.id);\n      } else if (isVendor) {\n        CMM.statechart.send('showVendor', model.id);\n      } else if (isPropertyVendor) {\n        CMM.statechart.send('showVendor', model.vendor.id, 'properties');\n      }\n    }"
                },
                {
                  "name": "cancelDeactivation",
                  "func": "function (model) {\n      var isProperty = model instanceof CMM.Property;\n      var isVendor = model instanceof CMM.Vendor;\n      var isPropertyVendor = model instanceof CMM.PropertyVendor;\n\n      this.goto('../off');\n\n      if (isProperty) {\n        CMM.statechart.send('showProperty', model.id);\n      } else if (isVendor) {\n        CMM.statechart.send('showVendor', model.id);\n      } else if (isPropertyVendor) {\n        CMM.statechart.send('showVendor', model.vendor.id, 'properties');\n      }\n    }"
                },
                {
                  "name": "showVendorContact",
                  "func": "function (contactId) {\n      CMM.appState.deactivationModel = undefined;\n      navigationHistory.unshift({\n        event: 'showVendorContact',\n        args: [contactId, /* viewOnly */true]\n      });\n    }"
                },
                {
                  "name": "showProperty",
                  "func": "function (propertyId, tab) {\n      CMM.appState.deactivationModel = undefined;\n      navigationHistory.unshift({\n        event: 'showProperty',\n        args: [propertyId, tab, /* viewOnly */true]\n      });\n    }"
                },
                {
                  "name": "showVendor",
                  "func": "function (vendorId, tab) {\n      CMM.appState.deactivationModel = undefined;\n      navigationHistory.unshift({\n        event: 'showVendor',\n        args: [vendorId, tab, /* editMode */false, /* viewOnly */true]\n      });\n    }"
                },
                {
                  "name": "selectTab",
                  "func": "function (tab) {\n      var currentItem = navigationHistory[0];\n      // Update the latest history so the user backs into the same tab they\n      // left\n      if (currentItem && (currentItem.event === 'showVendor' || currentItem.event === 'showProperty')) {\n        currentItem.args[/* tab index */1] = tab;\n      }\n    }"
                },
                {
                  "name": "goBack",
                  "func": "function () {\n      navigationHistory.shift();\n      if (navigationHistory && navigationHistory.length) {\n        var _CMM$statechart;\n\n        var _navigationHistory$sh = navigationHistory.shift();\n\n        var event = _navigationHistory$sh.event;\n        var args = _navigationHistory$sh.args;\n\n        (_CMM$statechart = CMM.statechart).send.apply(_CMM$statechart, [event].concat(_toConsumableArray(args)));\n      } else {\n        CMM.statechart.send('closeGlobalSearchModal');\n        this.goto('.', { context: { model: deactivationModel }, force: true });\n      }\n    }"
                }
              ],
              "children": null
            }
          ]
        },
        {
          "name": "resultModal",
          "concurrent": false,
          "events": [
            {
              "name": "showProperty",
              "func": "function (propertyId, tab, viewOnly) {\n        this.goto('./property/show', {\n          context: {\n            property: propertyId,\n            tab: tab,\n            viewOnly: viewOnly\n          },\n          force: true\n        });\n      }"
            },
            {
              "name": "createProperty",
              "func": "function (presetVendor) {\n        this.goto('./property/create', {\n          context: {\n            presetVendor: presetVendor\n          }\n        });\n      }"
            },
            {
              "name": "showVendor",
              "func": "function (vendorId, tab, editMode, viewOnly) {\n        this.goto('./vendor/show', {\n          context: {\n            vendor: vendorId,\n            tab: tab,\n            editMode: editMode,\n            viewOnly: viewOnly\n          },\n          force: true\n        });\n      }"
            },
            {
              "name": "createTermsAndConditions",
              "func": "function (ctx) {\n        this.goto('./vendor/termsAndConditions/create', {\n          context: ctx\n        });\n      }"
            },
            {
              "name": "setVendorActiveTermsAndConditions",
              "func": "function (terms, vendor) {\n        terms.makeActive(vendor).then(function () {\n          CMM.appState.allVendorTermsAndConditions = CMM.TermsAndConditions.query({\n            vendorId: vendor.id\n          });\n          CMM.flash.dismiss();\n          CMM.statechart.send('returnToVendorTsAndCs', true);\n        });\n      }"
            },
            {
              "name": "returnToVendorTsAndCs",
              "func": "function (force) {\n        this.goto('./vendor/show', {\n          context: {\n            viewOnly: false,\n            vendor: CMM.appState.searchDetailsCardModel.id,\n            tab: 'vendorTerms'\n          },\n          force: force\n        });\n      }"
            },
            {
              "name": "createVendorContact",
              "func": "function (context) {\n        this.goto('./vendor/contact/create', {\n          context: context\n        });\n      }"
            },
            {
              "name": "searchVendorContact",
              "func": "function (context) {\n        this.goto.apply(this, ['./vendor/contact/search'].concat(_toConsumableArray(context ? [{\n          context: context\n        }] : [])));\n      }"
            },
            {
              "name": "contactCreated",
              "func": "function (contact) {\n        CMM.analytics.track('contactCreated', {\n          agencyId: contact.agencyId,\n          contactId: contact.id\n        });\n      }"
            },
            {
              "name": "showVendorContact",
              "func": "function (contact, viewOnly, vendor) {\n        this.goto('./vendor/contact/show', {\n          context: {\n            viewOnly: viewOnly,\n            vendor: vendor,\n            contact: contact\n          }\n        });\n      }"
            },
            {
              "name": "editVendorContact",
              "func": "function (contactId) {\n        this.goto('./vendor/contact/edit', {\n          context: {\n            contact: contactId\n          }\n        });\n      }"
            },
            {
              "name": "createVendor",
              "func": "function (propertyVendorId) {\n        this.goto('./vendor/create');\n      }"
            },
            {
              "name": "closeGlobalSearchModal",
              "func": "function () {\n        this.goto('./off');\n      }"
            }
          ],
          "children": [
            {
              "name": "off",
              "concurrent": false,
              "events": [],
              "children": null
            },
            {
              "name": "property",
              "concurrent": false,
              "events": [],
              "children": [
                {
                  "name": "create",
                  "concurrent": false,
                  "events": [
                    {
                      "name": "toggleEditProperty",
                      "func": "function () {\n            this.goto('../../off');\n          }"
                    },
                    {
                      "name": "propertySaved",
                      "func": "function (property) {\n            CMM.flash.confirm('Property created successfully!');\n            CMM.analytics.track('propertyCreated', {\n              propertyId: property.id,\n              propertyName: property.name\n            });\n            this.goto('../show', {\n              context: {\n                property: CMM.appState.searchDetailsCardModel.id\n              }\n            });\n          }"
                    }
                  ],
                  "children": null
                },
                {
                  "name": "show",
                  "concurrent": false,
                  "events": [
                    {
                      "name": "selectTab",
                      "func": "function selectTab(tab) {\n        CMM.appState.cardTab = tab;\n        _this.params({\n          tab: tab\n        });\n      }"
                    }
                  ],
                  "children": [
                    {
                      "name": "edit",
                      "concurrent": false,
                      "events": [],
                      "children": [
                        {
                          "name": "off",
                          "concurrent": false,
                          "events": [
                            {
                              "name": "toggleEditProperty",
                              "func": "function () {\n                this.goto('../on');\n              }"
                            }
                          ],
                          "children": null
                        },
                        {
                          "name": "on",
                          "concurrent": false,
                          "events": [
                            {
                              "name": "toggleEditProperty",
                              "func": "function () {\n                var _this = this;\n                CMM.appState.searchDetailsCardModel.get().then(function () {\n                  _this.goto('../off');\n                });\n              }"
                            },
                            {
                              "name": "propertySaved",
                              "func": "function () {\n                CMM.flash.confirm('Changes saved successfully!');\n                this.goto('../off');\n              }"
                            }
                          ],
                          "children": null
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "name": "vendor",
              "concurrent": false,
              "events": [
                {
                  "name": "refreshVendors",
                  "func": "function () {\n          window.setTimeout(function () {\n            CMM.appState.searchResults = CMM.SearchResult.query({ searchQuery: CMM.appState.searchQuery });\n          }, 500);\n        }"
                }
              ],
              "children": [
                {
                  "name": "create",
                  "concurrent": false,
                  "events": [
                    {
                      "name": "vendorSaved",
                      "func": "function (vendor) {\n            CMM.flash.confirm('Vendor created successfully!');\n            CMM.analytics.track('vendorCreated', {\n              vendorId: vendor.id,\n              vendorName: vendor.name,\n              vendorType: vendor.typeName\n            });\n            CMM.statechart.send('refreshVendors');\n            this.goto('../show', {\n              context: {\n                vendor: CMM.appState.searchDetailsCardModel.id\n              }\n            });\n          }"
                    }
                  ],
                  "children": null
                },
                {
                  "name": "contact",
                  "concurrent": false,
                  "events": [],
                  "children": [
                    {
                      "name": "search",
                      "concurrent": false,
                      "events": [
                        {
                          "name": "successfullyAssociatedContact",
                          "func": "function () {\n              if (CMM.appState.addPropertyDialog) {\n                CMM.statechart.send('closeGlobalSearchModal');\n              } else {\n                CMM.statechart.send('showVendor', this.params().vendor, 'contacts');\n              }\n            }"
                        },
                        {
                          "name": "cancelAssociateContact",
                          "func": "function () {\n              this.send('successfullyAssociatedContact');\n            }"
                        }
                      ],
                      "children": null
                    },
                    {
                      "name": "show",
                      "concurrent": false,
                      "events": [],
                      "children": null
                    },
                    {
                      "name": "create",
                      "concurrent": false,
                      "events": [
                        {
                          "name": "successfullyCreatedContact",
                          "func": "function () {\n              if (CMM.appState.addPropertyDialog) {\n                CMM.statechart.send('closeGlobalSearchModal');\n              } else {\n                CMM.statechart.send('showVendor', this.params().vendor, 'contacts');\n              }\n            }"
                        }
                      ],
                      "children": null
                    },
                    {
                      "name": "edit",
                      "concurrent": false,
                      "events": [],
                      "children": null
                    }
                  ]
                },
                {
                  "name": "termsAndConditions",
                  "concurrent": false,
                  "events": [],
                  "children": [
                    {
                      "name": "create",
                      "concurrent": false,
                      "events": [],
                      "children": null
                    }
                  ]
                },
                {
                  "name": "show",
                  "concurrent": false,
                  "events": [
                    {
                      "name": "selectTab",
                      "func": "function (tab) {\n            updateNoActiveTermsAlert(tab);\n            selectTab(tab);\n          }"
                    },
                    {
                      "name": "vendorSaved",
                      "func": "function () {\n            CMM.flash.confirm('Changes saved successfully!');\n            CMM.statechart.send('refreshVendors');\n            this.goto('./edit/off');\n          }"
                    }
                  ],
                  "children": [
                    {
                      "name": "edit",
                      "concurrent": false,
                      "events": [],
                      "children": [
                        {
                          "name": "off",
                          "concurrent": false,
                          "events": [
                            {
                              "name": "toggleEditVendor",
                              "func": "function () {\n                this.goto('../on');\n              }"
                            }
                          ],
                          "children": null
                        },
                        {
                          "name": "on",
                          "concurrent": false,
                          "events": [
                            {
                              "name": "toggleEditVendor",
                              "func": "function () {\n                var _this = this;\n                CMM.appState.searchDetailsCardModel.get().then(function () {\n                  _this.goto('../off');\n                });\n              }"
                            }
                          ],
                          "children": null
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
