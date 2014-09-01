ContactManager.module("Entities",function(Entities,ContactManager,Backbone,Marionette,$,_){
	
	Entities.Contact=Backbone.Model.extend({
		url:"users",
		idAttribute:"userId",
		defaults:{
			userId:"",
			password:"",
			role:"nomal",
			firstName:"",
			lastName:"",
			phoneNumber:""
		},
		validate:function(attrs,options){
			var errors={};
			if(!attrs.firstName){
				errors.firstName="can't be blank";				
			}
			if(!attrs.lastName){
				errors.lastName="can't be blank";
			}
			else{
				if(attrs.lastName.length<2){
					errors.lastName="is too short";
				}
			}
			if(!_.isEmpty(errors)){
				return errors;
			}
		},
		save:function(attrs)
		{
			attrs.isNew=this.isNew();
			$.post(this.url,attrs,"json");
			
		},
		destroy: function(options) {
		   options = options ? _.clone(options) : {};
		   var model = this;
		   var success = options.success;
		
		   var destroy = function() {
		     model.trigger('destroy', model, model.collection, options);
		   };
		
		   options.success = function(resp) {
		     if (options.wait || model.isNew()) destroy();
		     if (success) success(model, resp, options);
		     if (!model.isNew()) model.trigger('sync', model, resp, options);
		   };
		   
		   if (this.isNew()) {
		     options.success();
		     return false;
		   }
		   wrapError(this, options);
		   var data=model.attributes;
		   data.isDelete=true;
		   $.post(this.url,data,"json");
		   
		   if (!options.wait) destroy();
		},
		
		fetch: function(options) {
	      options = options ? _.clone(options) : {};
	      if (options.parse === void 0) options.parse = true;
	      var model = this;
	      var success = options.success;
	      options.success = function(resp) {
	        if (!model.set(model.parse(resp, options), options)) return false;
	        if (success) success(model, resp, options);
	        model.trigger('sync', model, resp, options);
	      };
	      wrapError(this, options);
	      url=this.url+"/"+model.get('userId')+"/";
	      return $.ajax({type: "GET",url: url, dataType:"json"});
	   }
	});

	Entities.Login=Backbone.Model.extend({
		urlRoot:"login",
		defaults:{
			userId:"",
			password:""
		},
		validate:function(attrs,options){
			var errors={};
			if(!attrs.userId){
				errors.userId="can't be blank";				
			}
			if(!attrs.passWord){
				errors.passWord="can't be blank";
			}
			
			if(!_.isEmpty(errors)){
				return errors;
			}
		}
	});

	//Entities.configureStorage(Entities.Contact);

	Entities.ContactCollection=Backbone.Collection.extend({
		url:"contacts",
		model:Entities.Contact,
		comparator:"firstName"
	});
	//Entities.configureStorage(Entities.ContactCollection);
	
	var initializeContacts=function(){
		var contacts=new Entities.ContactCollection([
		{ userId:"admin",password:"admin",role:"admin",firstName:'Alice',lastName:'Arted',phoneNumber:'123123'}
		]);
		contacts.forEach(function(contact){
			contact.save();
		});

		return contacts.models;
	};

	var API={
		getContactEntities:function(){
			var contacts= new Entities.ContactCollection();
			
			var defer=$.Deferred();
			
			$.get('/getUsers',function(result){
				defer.resolve(result);
			},"json");
			
			var promise=defer.promise();
			$.when(promise).done(function(data){
				var contacts=new Entities.ContactCollection(data);
				if(contacts.length===0){
					var models=initializeContacts();
					contacts.reset(models);
				}
			});
			
			return promise;
		},
		getContactEntity: function(userId){
			var contact= new Entities.Contact({userId:userId});
			var defer=$.Deferred();
			
			contact.fetch().success(function(data)
					{
						defer.resolve(data);
					})
					.error(function(data){
						defer.resolve(undefined);
					});

			return defer.promise();
		}



	};
	ContactManager.reqres.setHandler("contact:entities",function(){
		return API.getContactEntities();
	});
	
	ContactManager.reqres.setHandler("contact:entity",function(id){
		return API.getContactEntity(id);
	});

	var wrapError = function(model, options) {
	    var error = options.error;
	    options.error = function(resp) {
	      if (error) error(model, resp, options);
	      model.trigger('error', model, resp, options);
	    };
  };
});




