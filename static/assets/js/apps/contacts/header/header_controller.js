ContactManager.module("ContactsApp.Header",function(Header,ContactManager,Backbone,Marionette,$,_){
	Header.Controller={
		showContact:function(){
			var showHeader=function(model){
				contactView= new Header.Contact({
						model:model
					});
				ContactManager.headerRegion.show(contactView);
			};
			var contactView;
			var model=ContactManager.loginUser;
			if(model!==null){
				showHeader(model);
			}
			else{
				url="currentuser";
				$.ajax({type: "GET",url: url, dataType:"json"})
					.success(function(data)
					{
						if(data.message)
						{
							ContactManager.loginUser=new ContactManager.Entities.Contact(data.model);
							showHeader(ContactManager.loginUser);
						}
						else
						{
							ContactManager.navigate("login");
							ContactManager.mainRegion.close();
							ContactManager.ContactsApp.Login.Controller.showContact();
						}
						
					});
			}
			
			

		}
		
		
	};
});