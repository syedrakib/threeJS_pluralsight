var sceneObj = (function(){

    var scene, camera, renderer;
    var cube, sphere, triangle;
    var stats;

    function initScene(){
        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(35, window.innerWidth/window.innerHeight , 1, 1000);
        camera.position.z = 100;

        renderer = window.WebGLRenderingContext ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById("webgl-container").appendChild(renderer.domElement);

        addCube();
        addSphere();
        addTriangle();

        addStatsPanel();
        render();
    }

    function addCube(){
        cube = new THREE.Mesh(
            new THREE.BoxGeometry(25,25,25),
            new THREE.MeshBasicMaterial({color: 0xff0000, wireframe:true})
        );
        cube.name = 'cube';
        scene.add(cube);
    }

    function addSphere(){
        sphere = new THREE.Mesh(
            new THREE.SphereGeometry(15,15,15),
            new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe:true})
        );
        sphere.name = 'sphere';
        scene.add(sphere);
    }

    function addTriangle(){
        var myGeometry = new THREE.Geometry();
        myGeometry.vertices.push(new THREE.Vector3(0.0, 1.0, 0.0));
        myGeometry.vertices.push(new THREE.Vector3(-1.0, -1.0, 0.0));
        myGeometry.vertices.push(new THREE.Vector3(1.0, -1.0, 0.0));
        myGeometry.faces.push(new THREE.Face3(0, 1, 2));
        triangle = new THREE.Mesh(myGeometry);
        triangle.scale.x = 10;
        triangle.scale.y = 10;
        scene.add(triangle);
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
        renderer.render(scene, camera);

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        cube.scale.x += 0.001;
        cube.scale.y += 0.001;

        sphere.rotation.x += 0.01;
        sphere.rotation.y += 0.01;

        stats.update();

        requestAnimationFrame(render);
    }

    window.onLoad = initScene();

    return scene;

})();
