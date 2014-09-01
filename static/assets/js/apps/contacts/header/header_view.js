ContactManager.module("ContactsApp.Header", function(Header, ContactManager,Backbone, Marionette, $, _){
	Header.Contact = Marionette.ItemView.extend({
		template:"#header-template",
		tagName:"ul",
		className:"nav",
		events:{
			"click a.js-logout":"logoutClicked"
		},
		logoutClicked:function(e){
			e.preventDefault();
			var url='logout';
			$.ajax({type: "GET",url: url, dataType:"json"})
			.success(function(data)
			{
				ContactManager.navigate("login");
				ContactManager.mainRegion.close();
				ContactManager.headerRegion.close();
				ContactManager.ContactsApp.Login.Controller.showContact();
			});
			
		}
	});
});