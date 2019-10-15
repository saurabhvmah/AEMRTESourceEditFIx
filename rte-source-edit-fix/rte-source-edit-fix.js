/**  rte-source-edit-fix.js **/
(function($, $document) {
  "use strict";

  var isInlineDialogActive;
  var fullScreenDialogSourceEditEl = "[data-type='dialogFullScreen'] .is-selected[data-action='misctools#sourceedit']";
  var inlineDialogSourceEditEL = "[data-type='inline'] .is-selected[data-action='misctools#sourceedit']";
  var rteSelector = "[data-rte-source-edit-fix='true']";
  var inlineDialogModeEl = "[data-type='inline'] coral-buttongroup.is-active";
  var fullScreenDialogModeEl = "[data-type='dialogFullScreen'] coral-buttongroup.is-active";

  $document.on("dialog-ready", function() {
    if ($(rteSelector).length > 0) {
      rteSourceEditFix();
    }
  });

  function rteSourceEditFix() {

    //by default inline rte mode is active when touch ui dialog opens up.
    isInlineDialogActive = true;

    $(".cq-dialog-layouttoggle").click(function(e) {

      //This is all done to adjust source edit button
      //Existing impl is written in such way that when you enable source edit on inline mode.
      //And then switch back to the Full Screen mode and then return to inline mode again.
      //As previously inline mode is having source edit on button will be having class "is-selected"
      //there but still plug will not be active there. So to fix this we are removing
      //this class initially after toggling the view.
      if (isInlineDialogActive) {
        isInlineDialogActive = false;
        $(fullScreenDialogSourceEditEl).removeClass("is-selected");
      } else {
        isInlineDialogActive = true;
        $(inlineDialogSourceEditEL).removeClass("is-selected");
      }
    });

    $(".cq-dialog-submit").click(function(e) {
      if (isSourceEditPlugInEnabled()) {
        e.preventDefault();
        e.stopPropagation();
        showPromptForSourceEditError();
      }
    });

  }

  /**
   * This Function checks if source edit plug in is enabled or not.
   */
  function isSourceEditPlugInEnabled() {
    if ($(inlineDialogModeEl).length > 0 && $(inlineDialogSourceEditEL).length > 0) {
      return true;
    }
    if ($(fullScreenDialogModeEl).length > 0 && $(fullScreenDialogSourceEditEl).length > 0) {
      return true;
    }
    return false;
  }

  /**
   * This function has been used to show error message in the form
   * of prompt when dialog is submitted and source edit plug in enabled.
   */
  function showPromptForSourceEditError() {
    var ui = $(window).adaptTo("foundation-ui");
    var message = "Please exit Source-edit mode before saving the changes.";
    var options = [{
      id: "ok",
      text: "OK",
      primary: true
    }];
    ui.prompt("Source Edit Plug In Is Active", message, "error", options);
  }


})($, $(document));