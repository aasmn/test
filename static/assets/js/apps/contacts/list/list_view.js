ContactManager.module("ContactsApp.List",function(List,ContactManager,Backbone,Marionette,$,_){
	List.Layout=Marionette.Layout.extend({
		template:"#contact-list-layout",
		regions:{
			panelRegion:"#panel-region",
			contactsRegion:"#contacts-region"
		}
	});
	List.Panel=Marionette.ItemView.extend({
		template:"#contact-list-panel",
		triggers:{
			"click button.js-new":"contact:new" 
		},
		events: {
			"submit #filter-form": "filterContacts"
		},
		ui: {
	      criterion: "input.js-filter-criterion"
	    },
	    onSetFilterCriterion: function(criterion){
      		this.ui.criterion.val(criterion);
    	},

		filterContacts: function(e){
			e.preventDefault();
			var criterion = this.$(".js-filter-criterion").val();
			this.trigger("contacts:filter", criterion);
		},
		
		onRender:function(){
			if(ContactManager.loginUser!=null){
				var role=ContactManager.loginUser.get("role");
				if(role=='nomal')
					this.$el.find("button.js-new").css('display','none');
			}
			return this;
			
		}
	});
	List.Contact=Marionette.ItemView.extend({
		tagName:'tr',
		template:'#contact-list-item',
		events:{
			"click":"highlightName",
			"click td a.js-show":"showClicked",
			"click button.js-delete": "deleteClicked",
			"click td a.js-edit":"editClick"
		},
		flash:function(cssClass){
			var $view=this.$el;
			$view.hide().toggleClass(cssClass).fadeIn(800,function(){
				setTimeout(function(){
					$view.toggleClass(cssClass);
				},500);
			});
		},
		highlightName:function(e){
			e.preventDefault();
			this.$el.toggleClass("warning");
		},
		showClicked:function(e){
			//e.preventDefault();
			e.stopPropagation();
			this.trigger("contact:show",this.model);
		},
		deleteClicked:function(e){
			e.stopPropagation();
			this.trigger("contact:delete",this.model);
		},
		editClick:function(e){
			e.preventDefault();
			e.stopPropagation();
			this.trigger("contact:edit",this.model);
		},
		remove:function(){
			var self = this;
			this.$el.fadeOut(1000,function(){
				$(this).fadeIn(1000);
				Marionette.ItemView.prototype.remove.call(self);
			});
		},
		onRender:function(){
			if(ContactManager.loginUser!=null){
				var role=ContactManager.loginUser.get("role");
				if(role=='nomal')
					this.$el.find("td.js-hidden").css('display','none');
			}
			return this;
			
		}
	});
	List.Contacts=Marionette.CompositeView.extend({
		tagName:'table',
		className:'table table-hover',
		template:"#contact-list",
		itemView:List.Contact,
		childView:List.Contact,
		itemViewContainer:"tbody",
		comparator: "firstName",

		onCompositeCollectionRendered:function(){
			this.appendHtml=function(collectionView,itemView,index){
				collectionView.$el.append(itemView.el);
			};
		}
	});
});