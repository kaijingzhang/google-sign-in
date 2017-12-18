var account_Signin = Extend(MasterClass,{
	init:function(){
		mfw.__init();
	},	
	//this method is called when ready.
	ready:function() {
		var o = this;

		mfw.__ready();
		// END BOUQ-150
		// window.onSmartLockLoad = (smartlock) => {
		//   console.log("smartlock loaded");
		// };
		if ($('body').hasClass('flowers-brand')) {
		  if($('body').hasClass('onetap')){    
		    o.onetap();
		  }
		  $(document).ready(function(){ 
		    $('#gSignInButton').click(function() {
		      // signInCallback defined in step 6.
		      auth2.grantOfflineAccess().then(o.googleSignInCallbackSY);
		    });
		  });
		}
	},
	
	// Use our own ajax call function with the desktop url
	googleSignInCallbackSY:function(authResult){
		FDSocial.showSocialProcessingMsg();
		var googleLoginURL = FDSocial.urlprefix + $("#googleLogonURL").val();

		if ($("#googleLogonURL").val() != "")
				googleLoginURL = googleLoginURL + "&connectType=" + $("#socialConnectType").val();
				console.log('sy google ajax url >> ' + googleLoginURL);
		if (authResult["code"])
				$.ajax({
						type: "POST",
						async: true,
						url: googleLoginURL,
						data: {
							"mDotDomain": window.location.origin,
							"authCode": authResult["code"]
						},
						headers: {
								"X-Requested-With": "XMLHttpRequest",
								"Content-type": "application/x-www-form-urlencoded"
						},
						success: function(data) {
								FDSocial.hideSocialProcessingMsg();
								if (data.success)
										if (data.promptLogon)
												FDSocial.loadFBloginForm(data, "google");
										else {
												FDSocial.showSocialProcessingMsg();
												if ($("#socialConnectType").val() != "" && $("#socialConnectType").val() == "googleConnect")
														FDSocial.displaySocialThankYou(data);
												else
														window.location.href = FDSocial.getLogOnRedirectURL()
										}
								else
										alert("We are sorry error occurred while connecting Google")
						}
				});
		else
				;
	},
	onetap:function() {
    	var hintResultPromise = smartlock.hint({
			supportedAuthMethods: [
			   "https://accounts.google.com"
			],
			supportedIdTokenProviders: [
			   {
			     uri: "https://accounts.google.com",
			     clientId: "1063797252869-6aqf0rm4rhvq8nrq06lsp2j3k015irnh.apps.googleusercontent.com",
			    
			   }
			],
			context: 'signIn' 
		});

		hintResultPromise.then(
		    (credential) => {
		      // The request was successful.
		      console.log("Hint returned for: " + credential.id);
		      
		      // when an ID token is returned, send it to your backend to
		      // sign in to an existing account, or trigger an account
		      // creation flow, as appropriate.
		      console.log("ID token returned" + credential.idToken);
		      //useIdTokenForAuth(credential.idToken);
		      FDSocial.showSocialProcessingMsg();
		        var googleLoginURL = FDSocial.urlprefix + $("#googleLogonURL").val();
		        if ($("#googleLogonURL").val() != "")
		            googleLoginURL = googleLoginURL + "&connectType=" + $("#socialConnectType").val();
		        if (credential.idToken){
		        	console.warn("CREDENTIAL >>>>>> 2 " + credential.idToken);
		            $.ajax({
		                type: "POST",
		                async: true,
		                url: googleLoginURL,
		                data: {
		                    "idToken" :  credential.idToken
		                },
		                headers: {
		                    "X-Requested-With": "XMLHttpRequest",
		                    "Content-type": "application/x-www-form-urlencoded"
		                },
		                success: function(data) {		                	
		                    FDSocial.hideSocialProcessingMsg();
		                    if (data.success) {
		                        if (data.promptLogon) {
		                        	console.log("==========>>>> "+ JSON.stringify(data));
		                            FDSocial.loadFBloginForm(data, "google");
		                        }
		                        else {
		                            FDSocial.showSocialProcessingMsg();
		                            if ($("#socialConnectType").val() != "" && $("#socialConnectType").val() == "googleConnect")
		                                FDSocial.displaySocialThankYou(data);
		                            else
		                                window.location.href = FDSocial.getLogOnRedirectURL()
		                        }
		                        $("#gplus_signin").attr("style", "display: none")
		                    } else
		                        alert("We are sorry error occurred while connecting Googlessssssss")
		                }
		            });
		        }
		        else
		            console.warn("NO CREDENTIAL");
		    })
		    .catch((err) => {
		      console.log("Hint request failed: ", err);
		      switch (err.type) {
		        case "userCanceled":
		          // The user manually canceled the flow. Depending on 
		          // the UX, request manual sign up or do nothing.		         
		          break;
		        case "noCredentialsAvailable":
		          // No hint available for the session. Depending on the UX,
		          // request manual sign up or do nothing.
		          break;
		        case "requestFailed":
		          // The request failed, most likely because of a timeout.
		          // You can retry another time if necessary.
		        case "operationCanceled":
		          // The operation was programmatically canceled, do nothing.
		        case "illegalConcurrentRequest":
		          // Another operation is pending, this one was aborted.
		        case "initializationError":
		          // Failed to initialize. Refer to the 
		          // error.message for debugging.
		        case "configurationError":
		          // Configuration error. Refer to the 
		          // error.message for debugging.
		        default:
		          // Unknown error, do nothing.
		      }
		 });

    }
	
});
