ContactManager.module("ContactsApp.List", function(List,ContactManager,Backbone,Marionette,$,_){
	List.Controller={
		listContacts:function(criterion){
			var loadingView=new ContactManager.Common.Views.Loading();

			ContactManager.mainRegion.show(loadingView);

			var fetchingContacts = ContactManager.request("contact:entities");
			var contactsListLayout=new List.Layout();
			var contactsListPanel=new List.Panel();

			$.when(fetchingContacts).done(function(data){

				var contacts=new ContactManager.Entities.ContactCollection(data);

				var filteredContacts=ContactManager.Entities.FilteredCollection({
					collection:contacts,
					filterFunction:function(filterCriterion){
						var criterion=filterCriterion.toLowerCase();
						return function(contact){
							if(contact.get("firstName").toLowerCase().indexOf(criterion)!==-1
								||contact.get("lastName").toLowerCase().indexOf(criterion)!==-1
								||contact.get('userId').toLowerCase().indexOf(criterion)!==-1)
							{
								return contact;
							}
						};
					}
				});

				if(criterion){
					filteredContacts.filter(criterion);
						contactsListPanel.once("show", function(){
						contactsListPanel.triggerMethod("set:filter:criterion", criterion);
					});
		        }

				
				var contactsListView = new List.Contacts({
					collection:filteredContacts
				});

				contactsListLayout.on("show",function(){
					contactsListLayout.panelRegion.show(contactsListPanel);
					contactsListLayout.contactsRegion.show(contactsListView);
				});

				contactsListPanel.on("contacts:filter",function(filterCriterion){
					filteredContacts.filter(filterCriterion);
					ContactManager.trigger("contacts:filter", filterCriterion);
				});

				contactsListView.on("itemview:contact:show",function(childView,model){
					//ContactManager.navigate("contacts/"+model.get("id"));
					ContactManager.trigger("contact:show", model.get("userId"));
					//ContactManager.ContactsApp.Show.Controller.showContact(model.get("id"));
				});

				contactsListView.on("itemview:contact:delete",function(childView,model){
					//contacts.remove(model);
					model.destroy();
				});

				contactsListView.on("itemview:contact:edit",function(childView,model){
					var view=new ContactManager.ContactsApp.Edit.Contact({
						model:model
					});

					view.on("form:submit",function(data){
						if(model.set(data,{validate:true})){
							model.save(data);
							childView.render();
							view.trigger("dialog:close");
							childView.flash("success");
						}
						else
						{
							view.triggerMethod("form:data:invalid",model.validationError);
						}
					});

					ContactManager.dialogRegion.show(view);
				});

				contactsListPanel.on("contact:new",function(){
					var newContact = new ContactManager.Entities.Contact();

					var view=new ContactManager.ContactsApp.New.Contact({
						model:newContact
					});

					view.on("form:submit",function(data){

						if(newContact.set(data,{validate:true})){
							newContact.save(data);
							contacts.add(newContact);
							view.trigger("dialog:close");
							var newContactView=contactsListView.children.findByModel(newContact);
							if(newContact)
								newContact.flash("success");
						}
						else
						{
							view.triggerMethod("form:data:invalid",newContact.validationError);
						}
					});

					ContactManager.dialogRegion.show(view);
				});

				ContactManager.mainRegion.show(contactsListLayout);

			});
			
			
		}

	};
});