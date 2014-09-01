ContactManager.module("ContactsApp.Login", function(Login, ContactManager,Backbone, Marionette, $, _){
	Login.Contact = ContactManager.ContactsApp.Common.Views.Form.extend({
		url:'/login',
		title: "Login",
		template:"#contact-login",
		events:{
			"click button.js-submit":"submitClicked"
		},
		onRender:function(){
			this.$(".js-submit").text("Login");
		},
		loginError:function(value){
			var $controlGroup=this.$el;
        	var $errorEl=$("<span>",{class:"login_error",text:value});
			$controlGroup.find(".login_error").remove();
        	$controlGroup.prepend($errorEl);
		}
	});
});