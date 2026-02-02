/* 1. NAVBAR BURGER MENÜ */
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');

burger.addEventListener('click', () => {
    nav.classList.toggle('nav-active');
});

/* -------------------------------------------------------------------------- */
/* 2. GITHUB API ENTEGRASYONU (Otomatik Proje Çekme)                          */
/* -------------------------------------------------------------------------- */

const projectContainer = document.getElementById('github-projects');

// DİKKAT: BURAYA KENDİ GITHUB KULLANICI ADINI YAZ (Tırnaklar içine)
const username = "nustafanert"; // Örn: mertcodes

async function getRepos() {
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
        
        if (!response.ok) {
             throw new Error("Kullanıcı bulunamadı");
        }
        
        const repos = await response.json();
        projectContainer.innerHTML = ''; // Yükleniyor yazısını temizle

        repos.forEach(repo => {
            if (!repo.fork) { // Sadece kendi projelerin
                
                // Dile göre ikon ve renk seçimi
                let iconClass = 'fas fa-code';
                let langColor = '#fff';

                if (repo.language === 'Dart' || repo.language === 'Flutter') {
                    iconClass = 'fab fa-google';
                    langColor = '#00f2ff'; // Cyan
                } else if (repo.language === 'Python' || repo.language === 'Jupyter Notebook') {
                    iconClass = 'fab fa-python';
                    langColor = '#00ff88'; // Green
                } else if (repo.language === 'Java') {
                    iconClass = 'fab fa-java';
                    langColor = '#ff5500'; // Orange
                } else if (repo.language === 'JavaScript' || repo.language === 'HTML') {
                    iconClass = 'fab fa-js';
                    langColor = '#f7df1e'; // Yellow
                }

                // Kart HTML'i
                const cardHTML = `
                <div class="project-card">
                    <div style="text-align:center; margin-bottom:15px;">
                        <i class="${iconClass}" style="font-size: 3rem; color: ${langColor};"></i>
                    </div>
                    <h3 style="font-size: 1.4rem; margin-bottom:10px;">${repo.name}</h3>
                    <p style="font-size: 0.9rem; color: #aaa; flex-grow: 1; margin-bottom:15px;">
                        ${repo.description ? repo.description.substring(0, 100) + (repo.description.length > 100 ? '...' : '') : 'Açıklama girilmemiş.'}
                    </p>
                    <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(255,255,255,0.1); padding-top:15px;">
                        <span style="font-size:0.8rem; color:${langColor};">${repo.language || 'Code'}</span>
                        <a href="${repo.html_url}" target="_blank" class="btn-small">
                            GitHub <i class="fas fa-external-link-alt"></i>
                        </a>
                    </div>
                </div>
                `;
                projectContainer.innerHTML += cardHTML;
            }
        });
        
        if (projectContainer.innerHTML === '') {
            projectContainer.innerHTML = '<p style="text-align:center; width:100%;">Gösterilecek repo bulunamadı.</p>';
        }

    } catch (error) {
        console.error('Hata:', error);
        projectContainer.innerHTML = '<p style="color:red; text-align:center; width:100%;">Projeler yüklenirken hata oluştu. Kullanıcı adını kontrol et.</p>';
    }
}

/* -------------------------------------------------------------------------- */
/* 3. CANVAS PARTICLE AĞI (Arka Plan)                                         */
/* -------------------------------------------------------------------------- */
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

let mouse = {
    x: null,
    y: null,
    radius: (canvas.height / 80) * (canvas.width / 80)
}

window.addEventListener('mousemove', 
    function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    }
);

window.addEventListener('resize', 
    function() {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        mouse.radius = ((canvas.height/80) * (canvas.height/80));
        init();
    }
);

window.addEventListener('mouseout',
    function(){
        mouse.x = undefined;
        mouse.y = undefined;
    }
)

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = '#00f2ff';
        ctx.fill();
    }
    update() {
        if (this.x > canvas.width || this.x < 0) { this.directionX = -this.directionX; }
        if (this.y > canvas.height || this.y < 0) { this.directionY = -this.directionY; }

        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        
        if (distance < mouse.radius + this.size){
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) { this.x += 10; }
            if (mouse.x > this.x && this.x > this.size * 10) { this.x -= 10; }
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) { this.y += 10; }
            if (mouse.y > this.y && this.y > this.size * 10) { this.y -= 10; }
        }
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 9000;
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        
        // --- DEĞİŞEN KISIM BURASI (HIZ AYARI) ---
        // Eskiden (Math.random() * 2) - 1 idi. (Hızlıydı)
        // Şimdi 0.4 ile çarpıp 0.2 çıkarıyoruz. (Çok daha yavaş)
        let directionX = (Math.random() * 0.4) - 0.2; 
        let directionY = (Math.random() * 0.4) - 0.2; 
        // ----------------------------------------

        particlesArray.push(new Particle(x, y, directionX, directionY, size, '#00f2ff'));
    }
}

function connect(){
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = (( particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
            + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            if (distance < (canvas.width/7) * (canvas.height/7)) {
                opacityValue = 1 - (distance/20000);
                ctx.strokeStyle = 'rgba(0, 242, 255,' + opacityValue + ')';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0,0,innerWidth, innerHeight);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

init();
animate();
getRepos(); // Projeleri çek