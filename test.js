"use strict";

var gl;
var canvas;
var program;
var vertices = [];
var colors = [];
var modelViewMatrix;
var projectionMatrix;
var uModelViewMatrix;
var uProjectionMatrix;
var fixedpointLoc;
var axisLoc;
var eyePosition = 0.0;
var fixed_point = [0.0, 0.0, 0.0];
var axis = [1.0, 1.0, 1.0];


// Function to scale points
function scalePoints(points, sx) {
    return points.map(point => vec3(point[0] * sx, point[1] * sx, point[2] * sx));
}

// Function to translate points
function translatePoints(points, tx, ty, tz) {
    return points.map(point => vec3(point[0] + tx, point[1] + ty, point[2] + tz));
}

function main() {
  canvas = document.getElementById("gl-canvas");
  gl = canvas.getContext('webgl2');
  if (!gl) {
    alert("WebGL 2.0 isn't available");
  }

  var points_O1 = [
    vec3(-0.8, 1, 0.05),
    vec3(-0.9, 1, 0.05),
    vec3(-0.8, -0.9, 0.05),
    vec3(-0.9, -1, 0.05),
    vec3(0.8, -0.9, 0.05),
    vec3(0.9, -1, 0.05),
    vec3(0.8, 0.9, 0.05),
    vec3(0.9, 1, 0.05),
    vec3(-0.8, 0.9, 0.05),
    vec3(-0.8, 1, 0.05),
  ];
    
  var colors_O1 = [
    vec4(1, 0, 0, 1),
    vec4(1, 0, 0, 1),
    vec4(1, 0, 0, 1),
    vec4(1, 0, 0, 1),
    vec4(1, 0, 0, 1),
    vec4(1, 0, 0, 1),
    vec4(1, 0, 0, 1),
    vec4(1, 0, 0, 1),
    vec4(1, 0, 0, 1),
    vec4(1, 0, 0, 1),
  ];
    
  var points_W = [
    vec3(-0.9, 1, 0.05),
    vec3(-0.8, 1, 0.05),
    vec3(-0.5, -1, 0.05),
    vec3(-0.4, -1, 0.05),
    vec3(-0.05, 1, 0.05),
    vec3(0.05, 1, 0.05),
    vec3(0.4, -1, 0.05),
    vec3(0.5, -1, 0.05),
    vec3(0.8, 1, 0.05),
    vec3(0.9, 1, 0.05), 
  ];
    
  var colors_W = [
    vec4(1, 0, 0, 1),
    vec4(1, 0, 0, 1),
    vec4(1, 0, 0, 1),
    vec4(1, 0, 0, 1),
    vec4(1, 0, 0, 1),
    vec4(1, 0, 0, 1),
    vec4(1, 0, 0, 1),
    vec4(1, 0, 0, 1),
    vec4(1, 0, 0, 1),
    vec4(1, 0, 0, 1),
  ];
    
  var points_U = [
    vec3(-0.8, 1, 0.05),
    vec3(-0.9, 1, 0.05),
    vec3(-0.8, -0.9, 0.05),
    vec3(-0.9, -1, -0.05),
    vec3(0.8, -0.9, 0.05),
    vec3(0.9, -1, 0.05),
    vec3(0.8, 1, 0.05),
    vec3(0.9, 1, 0.05),
  ];
    
  var colors_U = [
    vec4(1, 0, 0, 1),
    vec4(1, 0, 0, 1),
    vec4(1, 0, 0, 1),
    vec4(1, 0, 0, 1),
    vec4(1, 0, 0, 1),
    vec4(1, 0, 0, 1),
    vec4(1, 0, 0, 1),
    vec4(1, 0, 0, 1),
  ];

  var points_G= [
    vec3(-0.9, 1, -0.9),
    vec3(-0.9, 0.9, -0.9),
    vec3(-0.9, 1, 0.05),

    vec3(-0.9, 0.9, -0.9),
    vec3(-0.9, 1, 0.05),
    vec3(-0.9, 0.9, 0.05),

    vec3(-0.9, 0.9, 0.05),
    vec3(-0.9, 0.9, -0.1),
    vec3(-0.9, -1, 0.05),
    
    vec3(-0.9, 0.9, -0.1),
    vec3(-0.9, -1, 0.05),
    vec3(-0.9, -1, -0.1),

    vec3(-0.9, -1, -0.1),
    vec3(-0.9, -0.9, -0.1),
    vec3(-0.9, -1, -0.9),

    vec3(-0.9, -0.9, -0.1),
    vec3(-0.9, -1, -0.9),
    vec3(-0.9, -0.9, -0.9),

    vec3(-0.9, -0.9, -0.9),
    vec3(-0.9, -0.9, -0.8),
    vec3(-0.9, 0, -0.9),

    vec3(-0.9, -0.9, -0.8),
    vec3(-0.9, 0, -0.9),
    vec3(-0.9, 0, -0.8),

    vec3(-0.9, 0, -0.8),
    vec3(-0.9, -0.1, -0.8),
    vec3(-0.9, 0, -0.5),

    vec3(-0.9, -0.1, -0.8),
    vec3(-0.9, 0, -0.5),
    vec3(-0.9, -0.1, -0.5),
  ];

  var colors_G = [
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
  ];

  var points_O2 = [
    vec3(-0.9, 1, 0.05),
    vec3(-0.9, 0.9, 0.05),
    vec3(-0.9, 1, -0.9),

    vec3(-0.9, 0.9, 0.05),
    vec3(-0.9, 1, -0.9),
    vec3(-0.9, 0.9, -0.9),

    vec3(-0.9, 0.9, -0.9),
    vec3(-0.9, 0.9, -0.8),
    vec3(-0.9, -1, -0.9),

    vec3(-0.9, 0.9, -0.8),
    vec3(-0.9, -1, -0.9),
    vec3(-0.9, -1, -0.8),

    vec3(-0.9, -1, -0.8),
    vec3(-0.9, -0.9, -0.8),
    vec3(-0.9, -1, 0.05),

    vec3(-0.9, -0.9, -0.8),
    vec3(-0.9, -1, 0.05),
    vec3(-0.9, -0.9, 0.05),

    vec3(-0.9, -0.9, 0.05),
    vec3(-0.9, -0.9, -0.1),
    vec3(-0.9, 0.9, 0.05),

    vec3(-0.9, -0.9, -0.1),
    vec3(-0.9, 0.9, 0.05),
    vec3(-0.9, 0.9, -0.1),
  ];

  var colors_O2 = [
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
  ];

  var points_ExclamationMark = [
    vec3(0.9, 1, 0.05),
    vec3(0.9, 1, -0.1),
    vec3(0.9, -0.7, 0.05),

    vec3(0.9, 1, -0.1),
    vec3(0.9, -0.7, 0.05),
    vec3(0.9, -0.7, -0.1),

    vec3(0.9, -0.8, 0.05),
    vec3(0.9, -0.8, -0.1),
    vec3(0.9, -1, 0.05),

    vec3(0.9, -0.8, -0.1),
    vec3(0.9, -1, 0.05),
    vec3(0.9, -1, -0.1),
  ];

  var colors_ExclamationMark = [
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
    vec4(1, 1, 1, 1),
  ];

  var scaled_points_O1 = scalePoints(points_O1, 0.5);
  var scaled_points_W = scalePoints(points_W, 0.5);
  var scaled_points_U = scalePoints(points_U, 0.5);
  var scaled_points_G = scalePoints(points_G, 0.5);
  var scaled_points_O2 = scalePoints(points_O2, 0.5);
  var scaled_points_ExclamationMark = scalePoints(points_ExclamationMark, 0.5);

  var translated_points_O1 = translatePoints(scaled_points_O1, -1.0, 0.0, 1.0); 
  var translated_points_W = translatePoints(scaled_points_W, 0.0, 0.0, 0.5); 
  var translated_points_U = translatePoints(scaled_points_U, 1.0, 0.0, 0.0); 
  var translated_points_G = translatePoints(scaled_points_G, -1.0, 0.0, 1.0)
  var translated_points_O2 = translatePoints(scaled_points_O2, 0.0, 0.0, 0.5);
  var translated_points_ExclamationMark = translatePoints(scaled_points_ExclamationMark, 1.0, 0.0, 0.0); 
    
  vertices = translated_points_O1.concat(translated_points_W).concat(translated_points_U).concat(translated_points_G).concat(translated_points_O2).concat(translated_points_ExclamationMark);
  colors = colors_O1.concat(colors_W).concat(colors_U).concat(colors_G).concat(colors_O2).concat(colors_ExclamationMark);

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.0, .0, 1.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  var bufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

  var positionLoc = gl.getAttribLocation(program, "aPosition");
  gl.enableVertexAttribArray(positionLoc);
  gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);

  var colorbufferID = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorbufferID);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

  var colorLoc = gl.getAttribLocation(program, "aColor");
  gl.enableVertexAttribArray(colorLoc);
  gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);

  uModelViewMatrix = gl.getUniformLocation(program, 'uModelViewMatrix');
  uProjectionMatrix = gl.getUniformLocation(program, 'uProjectionMatrix');
  fixedpointLoc = gl.getUniformLocation(program, 'uFixedPoint');
  axisLoc = gl.getUniformLocation(program, 'uAxis');
    
  gl.uniform3fv(fixedpointLoc, fixed_point); 
  gl.uniform3fv(axisLoc, axis); 

  modelViewMatrix = lookAt(vec3(eyePosition, 0.0, 5.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0));
  projectionMatrix = ortho(-2.0, 2.0, -2.0, 2.0, -100.0, 100.0);

  gl.uniformMatrix4fv(uModelViewMatrix, false, flatten(modelViewMatrix));
  gl.uniformMatrix4fv(uProjectionMatrix, false, flatten(projectionMatrix));

  document.getElementById("left").onclick = function() {
    eyePosition -= 1; 
    modelViewMatrix = lookAt(vec3(eyePosition, 0.0, 5.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0));
    gl.uniformMatrix4fv(uModelViewMatrix, false, flatten(modelViewMatrix));
  };

  document.getElementById("right").onclick = function() {
    eyePosition += 1; 
    modelViewMatrix = lookAt(vec3(eyePosition, 0.0, 5.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0));
    gl.uniformMatrix4fv(uModelViewMatrix, false, flatten(modelViewMatrix));
  };

  render();
}

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 10);
  gl.drawArrays(gl.TRIANGLE_STRIP, 10, 10);
  gl.drawArrays(gl.TRIANGLE_STRIP, 20, 8);

  gl.drawArrays(gl.TRIANGLE_STRIP, 28, 30);
  gl.drawArrays(gl.TRIANGLES, 58, 24)
  gl.drawArrays(gl.TRIANGLES, 82, 12);

  requestAnimationFrame(render);
}

main();