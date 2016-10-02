(function ($, window, document) {
	"use strict";

	$.fn.popup = function (options) {
		// Default Settings
		var defaults = {
				url: "",
				id: "popupOverflow",
				target: "",
				type: "inline",
				className: "popupContent",
				animation: "bounceIn",
				iconPrefix: "xn",
				width: "auto",
				height: "auto",
				youtube_id: null,
				closeButton: true,
				closeOutside: true,
				disableTouchScroll: true,
				onClick: function (){},
				onClose: function(){}
			},
			popup = this,
			settings = $.extend({}, defaults, options);

		this.close = function () {
			$("#" + settings.id).fadeOut(128);
			$("#" + settings.id + " > div > div > div").removeClass("animated " + settings.animation).html("");
			settings.onClose();
		};

		return this.each(function () {
			var elem = $(this),
				url = elem.attr("href"),
				youtube_id = "";
				elem.settings  = settings;
				elem.settings.url = url;
				
			// If url is predefine
			if (elem.settings.url !== undefined) {
				// See if it's a youtube link
				youtube_id = elem.settings.url.match(/(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/);


				// Just to make sure that the url have youtube's domains
				if (elem.settings.url.indexOf("youtube.com") <= -1 && elem.settings.url.indexOf("youtu.be") <= -1) {
					elem.settings.youtube_id = null;
				}

				
				if (youtube_id !== null) {
					elem.settings.type = "iframe";
				}

				// If target is defined
				if (settings.target !== "") {
					elem.settings.url = elem.settings.url + " " + elem.settings.target;
				}
			}

			elem.click(function (e) {

				if(elem.attr('href')){
					elem.settings.url = elem.attr('href');
				}
				
				// Append all the necessary divs
				if ($("#popupOverflow").length === 0) {
					$("body").append("<div id='" + elem.settings.id + "' style='display:none'><div id='popupTable'><div id='popupMargin'></div></div></div>");
				}

				// Add loading content
				$("#" + elem.settings.id + " > div > div").html("<div id='popupContent' class='" + elem.settings.className + "'><div class='content'><p class='loading'><i class='" + elem.settings.iconPrefix +" " + elem.settings.iconPrefix +"-circle-o-notch " + elem.settings.iconPrefix +"-spin " + elem.settings.iconPrefix +"-5x'></i></p></div></div>");

				// Set Height and Width
				if (elem.settings.width != "auto") {
					$("#" + elem.settings.id + " > div > div > div > div").width (elem.settings.width);
				}
				if (elem.settings.height != "auto") {
					$("#" + elem.settings.id + " > div > div > div > div").height (elem.settings.height);
				}

				// Draw close button
				if (elem.settings.closeButton) {
					$("#" + elem.settings.id + " > div > div > div").append("<a href='#' class='close'><i class='" + elem.settings.iconPrefix +" " + elem.settings.iconPrefix +"-close'></i></a>");
				} else {
					$("#" + elem.settings.id + " .close").remove();
				}

				
				// // Display popup and prevent touch scroll event
				$("#" + elem.settings.id).fadeIn(100).on('touchmove', function(e) {
					if (elem.settings.disableTouchScroll) {
						e.preventDefault();
					}
				});

				// // Assign close action to close button
				if (elem.settings.closeButton) {
					$("#" + elem.settings.id + " .close").click(function (e) {
						popup.close();
						e.preventDefault();
					});
				}

				// Assign close action to shade area
				if (elem.settings.closeOutside) {
					$("#" + elem.settings.id + " > div > div").click(function (e) {
						if (e.target === this) {
							popup.close();
							e.preventDefault();
						}
					});
				}

				// // Type of the popup is inline
				if (elem.settings.type === "inline") {
				
					if (elem.settings.url !== undefined) {
				// 		// Ajax call
						$("#" + elem.settings.id + " > div > div > div > div").load( elem.settings.url, function( response, status, xhr ) {
							// Ir url is not found or connection is broken
							if ( status === "error" ) {
								if ($("#popupOverflow .close").length === 0) {
									$("#" + elem.settings.id + " > div > div > div").append("<a href='#' class='close'><i class='" + elem.settings.iconPrefix +" " + elem.settings.iconPrefix +"-close'></i></a>");
									$("#" + elem.settings.id + " .close").click(function (e) {
										popup.close();
										e.preventDefault();
									});
								}

								$("#" + elem.settings.id + " > div > div > div").addClass("animated " + elem.settings.animation)
								$("#" + elem.settings.id + " > div > div > div > div").html("<p class='error'><i class='" + elem.settings.iconPrefix +" " + elem.settings.iconPrefix +"-rocket " + elem.settings.iconPrefix +"-5x'></i><br />Error while loading your content<br />Please close this popup and try again</p>");
							}
						});
					} else if (elem.settings.target !== "") {
						$("#" + elem.settings.id + " > div > div > div > div").html($(elem.settings.target).html ());
					}


				// // Type of the popup is iframe
				} else if (elem.settings.type === "iframe") {
					if (youtube_id !== null) {
						$("#" + elem.settings.id + " > div > div > div > div").addClass("youtube").html ('<iframe width="800" height="450" src="https://www.youtube.com/embed/' + youtube_id[1] + '" frameborder="0" allowfullscreen></iframe>');
					} else {
						$("#" + elem.settings.id + " > div > div > div > div").html ("<iframe src='" + url + "' width='100%' height='100%' frameborder='0' />");
					}
				}

				// // Display or not close button
				if (!elem.settings.closeButton) {
					$("#" + elem.settings.id + " .close").remove();
				}

				// // Add animation
				$("#" + elem.settings.id + " > div > div > div").addClass("animated " + elem.settings.animation);

				elem.settings.onClick ();
				
				e.preventDefault();
			});
		});
	}
}(jQuery, window, document));
