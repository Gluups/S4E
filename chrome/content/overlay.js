/*
 * ***** BEGIN LICENSE BLOCK *****
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * 
 * Copyright (C) 2010, 2012-2014 Matthew Turnbull <sparky@bluefang-logic.com>. All Rights Reserved.
 * 
 * ***** END LICENSE BLOCK *****
 *
 * Toolbar popup handling code based on Mozilla Foundation code:
 * https://hg.mozilla.org/mozilla-central/file/6fae9d6feec8/browser/base/content/browser.js#l4114
 * Updated to add gNavToolbox.externalToolbars to toolbarNodes list.
*/

"use strict";

Components.utils.import("resource://status4evar/Australis.jsm");

function onViewToolbarsPopupShowing(aEvent, aInsertPoint) {
  var popup = aEvent.target;
  if (popup != aEvent.currentTarget)
    return;

  // Empty the menu
  for (var i = popup.childNodes.length-1; i >= 0; --i) {
    var deadItem = popup.childNodes[i];
    if (deadItem.hasAttribute("toolbarId"))
      popup.removeChild(deadItem);
  }

  var firstMenuItem = aInsertPoint || popup.firstChild;

  let toolbarNodes = Array.slice(gNavToolbox.childNodes);
  toolbarNodes = toolbarNodes.concat(Array.slice(gNavToolbox.externalToolbars));

  for (let toolbar of toolbarNodes) {
    let toolbarName = toolbar.getAttribute("toolbarname");
    if (toolbarName) {
      let menuItem = document.createElement("menuitem");
      let hidingAttribute = toolbar.getAttribute("type") == "menubar" ?
                            "autohide" : "collapsed";
      menuItem.setAttribute("id", "toggle_" + toolbar.id);
      menuItem.setAttribute("toolbarId", toolbar.id);
      menuItem.setAttribute("type", "checkbox");
      menuItem.setAttribute("label", toolbarName);
      menuItem.setAttribute("checked", toolbar.getAttribute(hidingAttribute) != "true");
      menuItem.setAttribute("accesskey", toolbar.getAttribute("accesskey"));
      if (popup.id != "toolbar-context-menu")
        menuItem.setAttribute("key", toolbar.getAttribute("key"));

      popup.insertBefore(menuItem, firstMenuItem);

      menuItem.addEventListener("command", onViewToolbarCommand, false);
    }
  }
}

if(!caligon) var caligon = {};

window.addEventListener("load", function buildS4E()
{
	window.removeEventListener("load", buildS4E, false);

	Components.utils.import("resource://status4evar/Status4Evar.jsm");

	caligon.status4evar = new Status4Evar(window, gBrowser, gNavToolbox, PanelUI);
	caligon.status4evar.setup();
}, false);

