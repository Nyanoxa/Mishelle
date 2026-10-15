
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const tables = [
    { id: 1, x: -3.5, z: -2.1, seats: 2 },
    { id: 2, x: 0, z: -2.1, seats: 4 },
    { id: 3, x: 3.5, z: -2.1, seats: 2 },
    { id: 4, x: -3.5, z: 2.1, seats: 4 },
    { id: 5, x: 0, z: 2.1, seats: 6 },
    { id: 6, x: 3.5, z: 2.1, seats: 4 }
];

let selectedTable = null;

const tableButtons = document.querySelector("#tableButtons");
const selectedInfo = document.querySelector("#selectedInfo");
const guests = document.querySelector("#guests");
const result = document.querySelector("#result");
const dateInput = document.querySelector("#date");
const timeInput = document.querySelector("#time");

const today = new Date();

const localDate = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
).toISOString().slice(0, 10);

dateInput.min = localDate;
dateInput.value = localDate;


// Выбор столика
const tableMeshes = [];

function selectTable(id) {
    const table = tables.find(t => t.id === id);

    if (!table) return;

    selectedTable = table;

    selectedInfo.textContent =
        `Столик №${table.id} · до ${table.seats} гостей`;

    document.querySelectorAll("#tableButtons button").forEach(btn => {
        const active = Number(btn.dataset.id) === id;

        btn.classList.toggle("active", active);
        btn.setAttribute("aria-pressed", String(active));
    });

    tableMeshes.forEach(({ mesh, tableId }) => {
        mesh.material.color.setHex(
            tableId === id ? 0x38533d : 0xb9986c
        );
    });

    result.hidden = true;
}


// Кнопки столиков
tables.forEach(table => {
    const button = document.createElement("button");

    button.type = "button";
    button.dataset.id = table.id;
    button.textContent = `№${table.id} · ${table.seats} места`;
    button.setAttribute("aria-pressed", "false");

    button.addEventListener("click", () => selectTable(table.id));

    tableButtons.append(button);
});


// 3D-сцена
const container = document.querySelector("#scene");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe2e5dc);

const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
camera.position.set(10, 12, 14);

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

container.append(renderer.domElement);


// Управление камерой
const controls = new OrbitControls(camera, renderer.domElement);

controls.target.set(0, 0, 0);
controls.enableDamping = true;
controls.minDistance = 7;
controls.maxDistance = 24;
controls.maxPolarAngle = Math.PI / 2.12;
controls.minPolarAngle = 0.25;
controls.update();


// Освещение
scene.add(new THREE.AmbientLight(0xffffff, 1.6));

const light = new THREE.DirectionalLight(0xfff5df, 2.2);

light.position.set(-4, 12, 7);
light.castShadow = true;
light.shadow.mapSize.set(1024, 1024);

scene.add(light);


// Материалы
const mat = color => new THREE.MeshStandardMaterial({
    color,
    roughness: 0.8
});

const floorMat = mat(0xd7d2c3);
const wallMat = mat(0xece8dc);
const chairMat = mat(0x647462);
const potMat = mat(0xbdb3a1);
const leafMat = mat(0x567359);


// Геометрия
function box(w, h, d, x, y, z, material) {
    const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, d),
        material
    );

    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    scene.add(mesh);

    return mesh;
}

function cylinder(rTop, rBottom, height, x, y, z, material) {
    const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(rTop, rBottom, height, 24),
        material
    );

    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    scene.add(mesh);

    return mesh;
}


// Пол и стены
box(12, 0.25, 9, 0, -0.15, 0, floorMat);
box(12, 3, 0.2, 0, 1.5, -4.6, wallMat);
box(0.2, 3, 9, -6.1, 1.5, 0, wallMat);


// Окна
for (const x of [-4, 0, 4]) {
    box(2.5, 1.6, 0.06, x, 1.8, -4.47, mat(0xa8c2b5));
    box(0.07, 1.65, 0.09, x, 1.8, -4.41, mat(0xf5f0e5));
    box(2.55, 0.07, 0.09, x, 1.8, -4.41, mat(0xf5f0e5));
}


// Стойка
box(2.5, 1.1, 0.7, 4.3, 0.55, 3.65, mat(0x7c6853));
box(2.65, 0.1, 0.85, 4.3, 1.15, 3.65, mat(0xc9b493));


// Растения
for (const [x, z] of [
    [-5.4, -3.8],
    [5.3, -3.7],
    [-5.4, 3.7]
]) {
    cylinder(0.33, 0.25, 0.65, x, 0.32, z, potMat);
    cylinder(0.08, 0.1, 0.85, x, 1.05, z, mat(0x665d48));

    for (let j = 0; j < 5; j++) {
        const leaf = new THREE.Mesh(
            new THREE.SphereGeometry(0.43, 10, 8),
            leafMat
        );

        leaf.scale.set(0.65, 1.15, 0.6);

        leaf.position.set(
            x + Math.sin(j * 2.5) * 0.3,
            1.45 + Math.cos(j * 3) * 0.17,
            z + Math.cos(j * 2.5) * 0.3
        );

        scene.add(leaf);
    }
}


// Столы и стулья
for (const table of tables) {
    const wood = mat(0xb9986c);

    cylinder(
        0.09, 0.13, 0.7,
        table.x, 0.5, table.z,
        mat(0x6e6254)
    );

    const radius = table.seats === 6 ? 0.82 : 0.66;

    const top = cylinder(
        radius, radius, 0.13,
        table.x, 0.88, table.z,
        wood
    );

    top.userData.tableId = table.id;

    tableMeshes.push({
        mesh: top,
        tableId: table.id
    });

    const chairRadius = table.seats === 6 ? 1.35 : 1.12;

    for (let i = 0; i < table.seats; i++) {
        const angle = i * Math.PI * 2 / table.seats;

        const cx = table.x + Math.cos(angle) * chairRadius;
        const cz = table.z + Math.sin(angle) * chairRadius;

        const chair = box(
            0.48, 0.12, 0.48,
            cx, 0.43, cz,
            chairMat
        );

        chair.rotation.y = -angle;

        cylinder(
            0.055, 0.055, 0.4,
            cx, 0.2, cz,
            mat(0x5c5548)
        );

        const back = box(
            0.48, 0.48, 0.09,
            cx + Math.cos(angle) * 0.23,
            0.75,
            cz + Math.sin(angle) * 0.23,
            chairMat
        );

        back.rotation.y = -angle;
    }
}


// Выбор столика в 3D
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

let down = null;

renderer.domElement.addEventListener("pointerdown", event => {
    down = {
        x: event.clientX,
        y: event.clientY
    };
});

renderer.domElement.addEventListener("pointerup", event => {
    if (!down) return;

    const distance = Math.hypot(
        event.clientX - down.x,
        event.clientY - down.y
    );

    down = null;

    if (distance > 7) return;

    const rect = renderer.domElement.getBoundingClientRect();

    pointer.x = (event.clientX - rect.left) / rect.width * 2 - 1;
    pointer.y = -(event.clientY - rect.top) / rect.height * 2 + 1;

    raycaster.setFromCamera(pointer, camera);

    const hits = raycaster.intersectObjects(
        tableMeshes.map(item => item.mesh)
    );

    if (hits.length) {
        selectTable(hits[0].object.userData.tableId);
    }
});


// Адаптация 3D
function resize() {
    const width = container.clientWidth;
    const height = container.clientHeight;

    if (!width || !height) return;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height, false);
}

new ResizeObserver(resize).observe(container);
resize();


// Анимация
function animate() {
    requestAnimationFrame(animate);

    controls.update();
    renderer.render(scene, camera);
}

animate();


// Проверка формы
document.querySelector("#bookingForm").addEventListener("submit", event => {
    event.preventDefault();

    if (!selectedTable) {
        selectedInfo.textContent = "Сначала выберите столик на плане";

        selectedInfo.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        return;
    }

    const count = Number(guests.value);

    if (!Number.isInteger(count) || count < 1 || count > 20) {
        result.hidden = false;
        result.textContent = "Введите количество гостей от 1 до 20.";
        return;
    }

    if (count > selectedTable.seats) {
        selectedInfo.textContent =
            `Столик №${selectedTable.id} рассчитан максимум на ${selectedTable.seats} гостей. Выберите другой столик.`;

        return;
    }

    const data = new FormData(event.currentTarget);

    const date = String(data.get("date"));
    const time = String(data.get("time"));

    if (!date || !time) {
        result.hidden = false;
        result.textContent = "Укажите дату и время.";
        return;
    }

    const selectedDateTime = new Date(`${date}T${time}:00`);

    if (
        Number.isNaN(selectedDateTime.getTime()) ||
        selectedDateTime.getTime() <= Date.now()
    ) {
        result.hidden = false;
        result.textContent = "Выберите будущую дату и время.";
        return;
    }

    result.hidden = false;

    result.textContent =
        `ПРОВЕРКА ЗАЯВКИ (ДЕМО)\n` +
        `Столик №${selectedTable.id} · ${count} гостей\n` +
        `${date} в ${time}\n` +
        `Имя: ${data.get("name")}\n` +
        `Телефон: ${data.get("phone")}\n\n` +
        `Бронирование НЕ отправлено.\n` +
        `Для реальной записи нужно подключить сервер или администратора.`;

    result.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });
});
