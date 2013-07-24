//= require embedapi
//= require base64

var svgCanvas = svgCanvas || {};

function submitHandler(event) {
  var id = event.data;
  svgCanvas[id].getSvgString()(function (data, error) {
    handleSvgData(data, error, id);
  });
}

function handleSvgData(data, error, id) {
  if (error) {
    alert('Error: ' + error);
  }
  else {
    var input = $("input#" + id);
    var form = input.closest("form");
    input.attr("value", sketchily_encode64("<?xml version=\"1.0\"?>\n" + data));
  }
}

function initEmbed(id, value, hide_menu, hide_image_tool, show_hyperlink_tool, hide_editor_panel, hide_history_panel, url) {
  var frame = document.getElementById("svgedit_" + id);
  svgCanvas[id] = new embedded_svg_edit(frame);

  var doc = frame.contentDocument;
  if (!doc) {
    doc = frame.contentWindow.document;
  }

  var tool_path_button = doc.getElementById('tool_path');
  tool_path_button.parentNode.removeChild(tool_path_button);

  var shape_lib_button = doc.getElementById('tools_shapelib_show');
  shape_lib_button.parentNode.removeChild(shape_lib_button);

  var tool_image_button = doc.getElementById('tool_image');
  tool_image_button.parentNode.removeChild(tool_image_button);

  var tool_zoom_button = doc.getElementById('tool_zoom');
  tool_zoom_button.parentNode.removeChild(tool_zoom_button);

  var tool_eyedropper_button = doc.getElementById('tool_eyedropper');
  tool_eyedropper_button.parentNode.removeChild(tool_eyedropper_button);

  var zoom_panel = doc.getElementById('zoom_panel');
  zoom_panel.parentNode.removeChild(zoom_panel);

  if (hide_editor_panel) {
    var editor_panel = doc.getElementById('editor_panel');
    editor_panel.parentNode.removeChild(editor_panel);
  }

  if (hide_history_panel) {
    var history_panel = doc.getElementById('history_panel');
    history_panel.parentNode.removeChild(history_panel);
  }

  if (hide_menu) {
    var mainButton = doc.getElementById('main_button');
    mainButton.parentNode.removeChild(mainButton);
    var toolsTop = doc.getElementById('tools_top');
    toolsTop.style.left = '5px';
  }

  if (hide_image_tool) {
    var imageTool = doc.getElementById('tool_image');
    imageTool.parentNode.removeChild(imageTool);
  }

  if (!show_hyperlink_tool) {
    var hyperlinkTool = doc.getElementById('tool_make_link');
    hyperlinkTool.parentNode.removeChild(hyperlinkTool);
  }

  if (!url) {
    svgCanvas[id].setSvgString(sketchily_decode64(value));
  }

  $("input#" + id).closest("form").on("submit.svgedit_" + id, null, id, submitHandler);

  $("#svgedit_" + id).css('visibility', '');
}

function attachLoadHandler(id, value, hide_menu, hide_image_tool, show_hyperlink_tool, hide_editor_panel, hide_history_panel, url) {
  var frame = $("#svgedit_" + id);
  if (frame.attr('src')) {
    frame.load(function () {
      initEmbed(id, value, hide_menu, hide_image_tool, show_hyperlink_tool, hide_editor_panel, hide_history_panel, url);
    });
  }
  else {
    setTimeout(function () {
      attachLoadHandler(id, value, hide_menu, hide_image_tool, show_hyperlink_tool, hide_editor_panel, hide_history_panel, url);
    }, 0);
  }
}
