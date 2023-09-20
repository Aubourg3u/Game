// Importer les bibliothèques Three.js

const container = document.getElementById('container');
const generateButton = document.getElementById('generateButton');

function getIntersection(list1, list2) {
    return list1.filter(element => list2.includes(element));
}

function findMinIndices(matrix) {
    let minValue = matrix[0][0];
    let minIndices = [0, 0];

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] < minValue) {
                minValue = matrix[i][j];
                minIndices = [i, j];
            }
        }
    }

    return minIndices;
}

function isIndexOutOfBounds(index, array) {
    return index < 0 || index >= array.length;
}

generateButton.addEventListener('click', () => {
    container.removeChild(generateButton);

    // Création d'un canvas Three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

	// Création d'un dictionnaire de textures
	const textureDict = {};

    // Chargement de toutes les textures du dossier
    const textureNames = ['DownLeft.png', 'DownRight.png', 'UpLeft.png', 'UpRight.png', 'Straight.png', 'Intersection.png', 'Green.png']; // Liste des noms de fichiers de textures

        const DonwLeftRules = [['DownRight.png',   'Straight.png',   'Intersection.png',   'UpRight.png'], 
						      ['Green.png',        'Straight.png',   'UpLeft.png',         'UpRight.png'], 
						      ['Green.png',        'DownRight.png',  'UpRight.png'], 
						      ['UpRight.png',      'UpLeft.png',     'Intersection.png']];
						   
						   
        const DonwRightRules = [['Green.png',     'UpLeft.png',     'DownLeft.png'], 
							   ['Green.png',      'Straight.png',   'UpLeft.png',         'UpRight.png'], 
							   ['DownLeft.png',   'Straight.png',   'Intersection.png',   'UpLeft.png'],
							   ['UpRight.png',    'UpLeft.png',     'Intersection.png']];
							
				
        const UpLeftRules = [['DownRight.png',   'Straight.png',     'Intersection.png',   'UpRight.png'], 
						    ['DownLeft.png',     'DownRight.png',    'Intersection.png'], 
						    ['Green.png',        'DownRight.png',    'UpRight.png'],
						    ['Green.png',        'Straight.png',     'DownRight.png',      'DownLeft.png']];
						 
						 
    const UpRightRules =  [['Green.png',     'DownLeft.png',    'UpLeft.png'], 
						  ['DownRight.png',  'DownLeft.png',    'Intersection.png'], 
						  ['DownLeft.png',   'UpLeft.png',      'Intersection.png',    'Straight.png'], 
						  ['Green.png',      'Straight.png',    'DownRight.png',       'DownLeft.png']];
						  
						  
    const StraightRules = [['Straight.png',    'Intersection.png',    'DownRight.png',   'UpRight.png'],
						  ['Green.png',        'Straight.png',        'UpLeft.png',      'UpRight.png'], 
						  ['Straight.png',     'Intersection.png',    'DownLeft.png',    'UpLeft.png'], 
						  ['Green.png',        'Straight.png',        'DownRight.png',   'DownLeft.png']];
						  
						  
    const IntersectionRules = [['Straight.png',    'Intersection.png',    'DownRight.png',       'UpRight.png'], 
							  ['DownRight.png',    'DownLeft.png',        'Intersection.png'], 
							  ['Straight.png',     'Intersection.png',    'DownLeft.png',        'UpLeft.png'], 
							  ['UpLeft.png',       'UpRight.png',        'Intersection.png']];
							  
    const GreenRules = [['Green.png',     'UpLeft.png',     'DownLeft.png'],
					   ['Green.png',      'Straight.png',   'UpLeft.png',         'UpRight.png'], 
					   ['Green.png',      'DownRight.png',  'UpRight.png'],
					   ['Green.png',      'Straight.png',   'DownRight.png',      'DownLeft.png']];
	
	const RuleDict = {
		'DownLeft.png': DonwLeftRules,
		'DownRight.png': DonwRightRules,
		'UpLeft.png': UpLeftRules,
		'UpRight.png': UpRightRules,
		'Straight.png': StraightRules,
		'Intersection.png': IntersectionRules,
		'Green.png': GreenRules
	};
	
	textureNames.forEach(textureName => {
		const textureLoader = new THREE.TextureLoader();
		const texturePath = `public/TileSet/Map/${textureName}`;
		const texture = textureLoader.load(texturePath);
		textureDict[textureName] = texture;
	});
	
	console.log(textureDict);

    // Fonction pour créer un carré avec une texture donnée
    const createSquareWithTexture = (texture) => {
        const geometry = new THREE.PlaneGeometry(squareSize, squareSize);
        const material = new THREE.MeshBasicMaterial({ map: texture });
        return new THREE.Mesh(geometry, material);
    };

    // Création du maillage régulier de carrés
    const rows = 20;
    const cols = 20;
    const squareSize = 1;
    const spacing = 1;

    const indicesList = []; // Liste des indices sous forme de couples d'indices

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            indicesList.push([i, j]); // Ajout du couple d'indices à la liste
        }
    }

    function ComputeEntropy(Map) {
		const entropyArray = [];
		var TotalEntropy = 0;
		// Create the entropy array
		for (let i = 0; i < rows; i++) {
			const row = [];
			for (let j = 0; j < cols; j++) {
				if (Array.isArray(Map[i][j])) {
					TotalEntropy = TotalEntropy+1;
					row.push(Map[i][j].length); // Initialisation avec la valeur 7
				} else {
					row.push(999)
				}
				
			}
			entropyArray.push(row);
		}
		if (TotalEntropy == 0) {
			run = false;
		}
		
		return entropyArray;
	}
	const Map = [];
	var ilen;
	var jlen ;
	var run = true;
	
	function RunWaveFunctionCollapse () {
		
		// Create the entropy array
		for (let i = 0; i < rows; i++) {
			const row = [];
			for (let j = 0; j < cols; j++) {
				row.push(textureNames)			
			}
			Map.push(row);
		}
		console.log(Map);
		
		// Collapsing the middle cell
		ilen = Map.length;
		jlen = Map[0].length;
		const iMid = Math.floor(ilen / 2);
		const jMid = Math.floor(jlen / 2);
		const randInd = Math.floor(Math.random() * Map[iMid][jMid].length);		
		Map[iMid][jMid] = Map[iMid][jMid][randInd];
		MapValue = Map[iMid][jMid];
		if (MapValue !== 0) {
			if (!isIndexOutOfBounds(jMid-1, Map[iMid])) {
				if (Array.isArray(Map[iMid][jMid-1])) {
					Map[iMid][jMid-1] = getIntersection(Map[iMid][jMid-1],RuleDict[MapValue][0]);
				}
			}
			if (!isIndexOutOfBounds(iMid-1, Map)) {
				if (Array.isArray(Map[iMid-1][jMid])) {
					Map[iMid-1][jMid] = getIntersection(Map[iMid-1][jMid],RuleDict[MapValue][1]);
				}
			}
			if (!isIndexOutOfBounds(jMid+1, Map[iMid])) {
				if (Array.isArray(Map[iMid][jMid+1])) {
					Map[iMid][jMid+1] = getIntersection(Map[iMid][jMid+1],RuleDict[MapValue][2]);
				}
			}
			if (!isIndexOutOfBounds(iMid+1, Map)) {
				if (Array.isArray(Map[iMid+1][jMid])) {
					Map[iMid+1][jMid] = getIntersection(Map[iMid+1][jMid],RuleDict[MapValue][3]);
				}
			}
		}
		entropyArray = ComputeEntropy(Map);
		
		
		var entropyArray = ComputeEntropy(Map);
				
		// Go through the map to modify entropy
		while (run) {
			const indicesMin = findMinIndices(entropyArray);
			const i = indicesMin[0];
			const j = indicesMin[1];
			const RandomIndex = Math.floor(Math.random() * Map[i][j].length);
			Map[i][j] = Map[i][j][RandomIndex];
			MapValue = Map[i][j];
			if (MapValue !== 0) {
				if (!isIndexOutOfBounds(j-1, Map[i])) {
					if (Array.isArray(Map[i][j-1])) {
						Map[i][j-1] = getIntersection(Map[i][j-1],RuleDict[MapValue][0]);
					}
				}
				if (!isIndexOutOfBounds(i-1, Map)) {
					if (Array.isArray(Map[i-1][j])) {
						Map[i-1][j] = getIntersection(Map[i-1][j],RuleDict[MapValue][1]);
					}
				}
				if (!isIndexOutOfBounds(j+1, Map[i])) {
					if (Array.isArray(Map[i][j+1])) {
						Map[i][j+1] = getIntersection(Map[i][j+1],RuleDict[MapValue][2]);
					}
				}
				if (!isIndexOutOfBounds(i+1, Map)) {
					if (Array.isArray(Map[i+1][j])) {
						Map[i+1][j] = getIntersection(Map[i+1][j],RuleDict[MapValue][3]);
					}
				}
			}
			entropyArray = ComputeEntropy(Map);
		}
	}
	
	RunWaveFunctionCollapse();
	
	
	console.log(Map);

    // Maintenant vous pouvez utiliser la liste d'indices pour créer les carrés
    indicesList.forEach((indices, index) => {
        var [i, j] = indices;
		texure = textureDict[Map[i][j]];
		i = ilen - i - 1 ;
        const square = createSquareWithTexture(texure);
        square.position.x = j * spacing - (cols - 1) * spacing / 2;
        square.position.y = i * spacing - (rows - 1) * spacing / 2;
        scene.add(square);
    });

    // Positionner la caméra
    camera.position.z = 5;

    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    // Ajoute des écouteurs pour gérer le début et la fin du glissement de souris
    renderer.domElement.addEventListener('mousedown', (event) => {
        if (event.button === 0) {
            isDragging = true;
            previousMousePosition.x = event.clientX;
            previousMousePosition.y = event.clientY;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Fonction pour tourner la caméra en fonction du déplacement de la souris
    const rotateCamera = (event) => {
        if (isDragging) {
            const movementX = event.clientX - previousMousePosition.x;
            const movementY = event.clientY - previousMousePosition.y;

            const rotationSpeed = 0.005;
            camera.rotation.y -= movementX * rotationSpeed;
            camera.rotation.x -= movementY * rotationSpeed;

            previousMousePosition.x = event.clientX;
            previousMousePosition.y = event.clientY;
        }
    };
	
	// Ajoutez une variable pour la vitesse de déplacement latéral
	const lateralSpeed = 0.1;
	const verticalSpeed = 0.1;

	// Écoutez l'événement keydown pour détecter les touches fléchées gauche et droite
	document.addEventListener('keydown', (event) => {
		console.log(event.key);
		switch (event.key) {
			
			case 'ArrowLeft':
				// Déplacer la caméra vers la gauche
				camera.position.x -= lateralSpeed;
				break;
			case 'ArrowRight':
				// Déplacer la caméra vers la droite
				camera.position.x += lateralSpeed;
				break;
			case 'ArrowUp':
				// Déplacer la caméra vers le haut
				camera.position.y += verticalSpeed;
				break;
			case 'ArrowDown':
				// Déplacer la caméra vers le bas
				camera.position.y -= verticalSpeed;
				break;
		}
	});

    const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    };

    // Fonction de redimensionnement du rendu Three.js lorsque la fenêtre est redimensionnée
    const resizeRendererToDisplaySize = () => {
        const canvas = renderer.domElement;
        const width = window.innerWidth;
        const height = window.innerHeight;
        const needResize = canvas.width !== width || canvas.height !== height;

        if (needResize) {
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        }
    };

	

	
    animate();
	
	reloadButton.addEventListener('click', () => {
		// Supprimer les anciens carrés de la scène (s'ils existent)
		scene.children.forEach(child => {
			if (child instanceof THREE.Mesh) {
				scene.remove(child);
			}
		});

		// Réinitialiser les tableaux Map et entropyArray
		Map.length = 0; // Réinitialiser Map en vidant le tableau
		
		run = true;

		// Appeler à nouveau la fonction RunWaveFunctionCollapse pour régénérer la carte
		RunWaveFunctionCollapse();

		// Recréer les carrés avec les nouvelles textures
		indicesList.forEach((indices, index) => {
			var [i, j] = indices;
			texure = textureDict[Map[i][j]];
			i = ilen - i - 1;
			const square = createSquareWithTexture(texure);
			square.position.x = j * spacing - (cols - 1) * spacing / 2;
			square.position.y = i * spacing - (rows - 1) * spacing / 2;
			scene.add(square);
		});

		// Redimensionner le rendu
		resizeRendererToDisplaySize();
	});
	
	// Ajoutez un écouteur pour l'événement de la molette
	renderer.domElement.addEventListener('wheel', (event) => {
		const zoomSpeed = 0.1; // Vitesse de zoom
		const delta = event.deltaY; // Direction et magnitude de la molette

		// Zoom in (approcher la caméra) pour une molette vers le haut (delta positif)
		if (delta > 0) {
			camera.position.z -= zoomSpeed;
		}
		// Zoom out (éloigner la caméra) pour une molette vers le bas (delta négatif)
		else {
			camera.position.z += zoomSpeed;
		}
	});
		
    window.addEventListener('resize', resizeRendererToDisplaySize);
}); // Ajoutez cette accolade fermante
