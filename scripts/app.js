var sceneObj = (function(){

    "use strict";

    Physijs.scripts.worker = "scripts/physijs_worker.js";
    Physijs.scripts.ammo = "ammo.js";

    // environment items
    var scene, light, camera, renderer, controls;
    // ThreeJS primitive objects
    var cube, sphere, triangle;
    // objects loaded from 3rd party models
    var monster, monkey;
    // objects for PhysiJS simulation
    var physijsBox, physijsGround
    // other helpful utilities
    var stats;

    function initScene(){
        scene = new Physijs.Scene();
        scene.setGravity = new THREE.Vector3(0, -50, 0);

        // Light is required to illuminate non-basic materials - like 3rd party models, textures, etc
        light = new THREE.AmbientLight(0xffffff);
        scene.add(light);

        camera = new THREE.PerspectiveCamera(35, window.innerWidth/window.innerHeight , 1, 1000);
        camera.position.z = 100;

        renderer = window.WebGLRenderingContext ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById("webgl-container").appendChild(renderer.domElement);

        controls = new THREE.OrbitControls(camera);
        controls.addEventListener('change', render);

        addCube();
        addSphere();
        addTriangle();
        addMonsterViaColladaLoader();
        addMonkeyViaJSONLoader();

        addPhysijsBox();
        addPhysijsGround();

        addStatsPanel();
        render();
    }

    function addCube(){
        cube = new THREE.Mesh(
            new THREE.BoxGeometry(25,25,25),
            new THREE.MeshBasicMaterial({
                color: 0xff0000,
                map: THREE.ImageUtils.loadTexture('content/crate.gif')
            })
        );
        cube.name = 'cube';
        cube.position.x = -40;
        scene.add(cube);
    }

    function addSphere(){
        sphere = new THREE.Mesh(
            new THREE.SphereGeometry(15,15,15),
            new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe:true})
        );
        sphere.name = 'sphere';
        sphere.position.x = -15;
        scene.add(sphere);
    }

    function addTriangle(){
        var myGeometry = new THREE.Geometry();
        myGeometry.vertices.push(new THREE.Vector3(0.0, 1.0, 0.0));
        myGeometry.vertices.push(new THREE.Vector3(-1.0, -1.0, 0.0));
        myGeometry.vertices.push(new THREE.Vector3(1.0, -1.0, 0.0));
        myGeometry.faces.push(new THREE.Face3(0, 1, 2));
        myGeometry.faces[0].vertexColors[0] = new THREE.Color(0xff0000);
        myGeometry.faces[0].vertexColors[1] = new THREE.Color(0x00ff00);
        myGeometry.faces[0].vertexColors[2] = new THREE.Color(0x0000ff);

        var myMaterial = new THREE.MeshBasicMaterial({
            vertexColors: THREE.VertexColors,
            side: THREE.DoubleSide // DoubleSide required to render both front-&-rear faces when the flat triangle is rotated
        })

        triangle = new THREE.Mesh(myGeometry, myMaterial);
        triangle.scale.x = 10;
        triangle.scale.y = 10;
        triangle.position.x = 15;
        scene.add(triangle);
    }

    function addMonsterViaColladaLoader(){
        var loader = new THREE.ColladaLoader();
        loader.options.convertUpAxis = true;    // To callibrate the up-axis of this model with the screen
        loader.load(
            'models/collada/monster/monster.dae',
            function(collada){
                monster = collada.scene;
                monster.position.y = -10; // adjusting the monster's position on the screen
                monster.position.x = 40;
                scene.add(monster);
            }
        )
    }

    function addMonkeyViaJSONLoader(){
        var loader = new THREE.JSONLoader();
        loader.load("models/monkey.js", function(geometry, materials) {
            var monkeyMaterial = new THREE.MeshBasicMaterial({
                color: 0xffff00,
                wireframe: true
            });
            monkey = new THREE.Mesh(geometry, monkeyMaterial);
            monkey.scale.x = 10;
            monkey.scale.y = 10;
            monkey.scale.z = 10;
            scene.add(monkey);
        });
    }

    function addPhysijsBox(){
        var myBoxGeometry = new THREE.CubeGeometry(15,15,15);
        for (var i=0; i<myBoxGeometry.faces.length; i+=2) {
            var colorShade = Math.random() * 0xffffff;
            myBoxGeometry.faces[i].color.setHex(colorShade);
            myBoxGeometry.faces[i+1].color.setHex(colorShade);
        }
        var myBoxMaterial = Physijs.createMaterial(
            new THREE.MeshBasicMaterial({
                vertexColors: THREE.FaceColors
            }),
            0,  // friction
            0.8 // restitution / bounciness
        );
        physijsBox = new Physijs.BoxMesh(
            myBoxGeometry, 
            myBoxMaterial
        );
        physijsBox.position.set(0,30,10);
        physijsBox.rotation.set(0,50,90);
        scene.add(physijsBox);
    }

    function addPhysijsGround(){
        var myGroundMaterial = Physijs.createMaterial(
            new THREE.MeshBasicMaterial({
                color: 0x008888
            }),
            0, // friction
            0.4 // restitution / bounciness
        );
        physijsGround = new Physijs.BoxMesh(
            new THREE.CubeGeometry(150, 3, 150),
            myGroundMaterial,
            0
        );
        physijsGround.position.y = -15;
        scene.add(physijsGround);
    }

    function addStatsPanel(){
        stats = new Stats();
        stats.setMode(0);
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        document.body.appendChild(stats.domElement);
    }

    function render(){
        scene.simulate(); // to kick-off the physiJS physics engine
        renderer.render(scene, camera);

        /*
            Stop all animation of objects.
            Screen events will re-render the scene.
            If animations are also incrementally occurring at every scene render, it will multiply the animations by several factors.
        */
        // cube.rotation.x += 0.01;
        // cube.rotation.y += 0.01;
        // cube.scale.x += 0.001;
        // cube.scale.y += 0.001;
        //
        // sphere.rotation.x += 0.01;
        // sphere.rotation.y += 0.01;
        //
        // triangle.rotation.y += 0.01;
        //
        // // Rotate the monster if/after the monster variable has been successfully instantiated.
        // // The monster variable is instantiated inside the onLoad callback of the ColladaLoader's load() function.
        // if (typeof monster !== 'undefined') {
        //     monster.rotation.y += 0.02;
        // }
        // if (typeof monkey !== 'undefined') {
        //     monkey.rotation.y -= 0.02;
        // }

        stats.update();

        requestAnimationFrame(render);
    }

    window.onLoad = initScene();

    return scene;

})();
