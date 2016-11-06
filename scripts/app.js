var sceneObj = (function(){

    var scene, camera, renderer, cube;

    function initScene(){
        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(35, window.innerWidth/window.innerHeight , 1, 1000);
        camera.position.z = 100;

        renderer = window.WebGLRenderingContext ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById("webgl-container").appendChild(renderer.domElement);

        cube = new THREE.Mesh(
            new THREE.BoxGeometry(25,25,25),
            new THREE.MeshBasicMaterial({color: 0xff0000})
        );
        cube.name = 'cube';
        scene.add(cube);

        render();
    }

    function render(){
        renderer.render(scene, camera);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        requestAnimationFrame(render);
    }

    window.onLoad = initScene();

    return scene;

})();
