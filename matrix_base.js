var createScene = function () {
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0, 0, 0); // Set background to black

    // Camera setup
    var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 2, 40, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    // Create GUI
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    // Parameters for the cubes
    const numRows = 16;
    const numCols = 16;
    const cubeSize = 1; // Size of each cube
    const gap = 0.1; // Small gap between cubes

    // Create a parent mesh for all cubes
    var parentMesh = new BABYLON.TransformNode("parentMesh");

    // Generate the cubes and apply gradient colors
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            var index = row * numCols + col; // Compute index from 0 to 255
            var fraction = index / 255;
            var color = new BABYLON.Color3.Lerp(
                new BABYLON.Color3(1, 1, 1), // White
                new BABYLON.Color3(0.678, 0.847, 0.902), // Light blue
                fraction
            );

            var cube = BABYLON.MeshBuilder.CreateBox("cube" + index, { size: cubeSize }, scene);
            var emissiveMaterial = new BABYLON.StandardMaterial("emissiveMat" + index, scene);
            emissiveMaterial.emissiveColor = color;
            emissiveMaterial.backFaceCulling = false; // Make it visible from both sides
            cube.material = emissiveMaterial;
            cube.parent = parentMesh;
            cube.position.x = (col - numCols / 2 + 0.5) * (cubeSize + gap);
            cube.position.y = (row - numRows / 2 + 0.5) * (cubeSize + gap);

            // Add actions for hover
            cube.actionManager = new BABYLON.ActionManager(scene);
            cube.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function(ev){
                // Show label on hover
                cubeLabel.text = "Value: " + index;
                cubeLabel.linkWithMesh(cube);
                cubeLabel.isVisible = true;
            }));
            cube.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function(ev){
                // Hide label when not hovering
                cubeLabel.isVisible = false;
            }));
        }
    }

    // Label for displaying cube values
    var cubeLabel = new BABYLON.GUI.Rectangle();
    cubeLabel.width = "100px";
    cubeLabel.height = "40px";
    cubeLabel.cornerRadius = 20;
    cubeLabel.color = "white";
    cubeLabel.thickness = 2;
    cubeLabel.background = "black";
    cubeLabel.isVisible = false;
    advancedTexture.addControl(cubeLabel);

    var text1 = new BABYLON.GUI.TextBlock();
    text1.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    text1.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    text1.text = "ASDAS";
    text1.color = "white";
    cubeLabel.addControl(text1);

    // Position the parent mesh in the center and rotate to face the camera
    parentMesh.position.z = 10; // Move forward in z slightly to avoid clipping with camera at origin
    parentMesh.rotation.y = Math.PI / 2; // Rotate to make vertical

    return scene;
};

var engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
var scene = createScene();
engine.runRenderLoop(function () {
    scene.render();
});

window.addEventListener('resize', function () {
    engine.resize();
});
