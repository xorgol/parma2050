document.addEventListener("DOMContentLoaded", function() {
    // 1. Resolve relative path to root by finding the script element path
    var rootPath = "./";
    var scripts = document.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; i++) {
        var src = scripts[i].getAttribute("src");
        if (src && src.indexOf("nav.js") !== -1) {
            rootPath = src.replace("nav.js", "");
            break;
        }
    }

    // 2. Create the navigation container
    var nav = document.createElement("nav");
    nav.className = "persistent-nav";
    
    // Brand link
    var brandDiv = document.createElement("div");
    brandDiv.className = "nav-brand";
    brandDiv.innerHTML = '<a href="' + rootPath + 'index.html">Parma 2050</a>';
    nav.appendChild(brandDiv);
    
    // Mobile toggle button
    var toggleBtn = document.createElement("button");
    toggleBtn.className = "nav-toggle";
    toggleBtn.setAttribute("aria-label", "Toggle navigation");
    toggleBtn.innerHTML = "☰ Menu";
    toggleBtn.onclick = function() {
        var menu = document.getElementById("navMenu");
        if (menu.className === "nav-menu") {
            menu.className = "nav-menu active";
        } else {
            menu.className = "nav-menu";
        }
    };
    nav.appendChild(toggleBtn);
    
    // Menu wrapper
    var menuDiv = document.createElement("div");
    menuDiv.className = "nav-menu";
    menuDiv.id = "navMenu";
    
    // Main site links
    var siteSection = document.createElement("div");
    siteSection.className = "nav-section";
    siteSection.innerHTML = '<span class="nav-section-title">Site:</span>' +
        '<a href="' + rootPath + 'introduzione/index.html">Introduzione</a>' +
        '<a href="' + rootPath + 'temi/index.html">Temi</a>' +
        '<a href="' + rootPath + 'vision/index.html">Vision</a>' +
        '<a href="' + rootPath + 'scenari/index.html">Scenari</a>' +
        '<a href="' + rootPath + 'atlante/index.html">Atlante</a>' +
        '<a href="' + rootPath + 'disciplina/index.html">Disciplina</a>' +
        '<a href="' + rootPath + 'valsat/index.html">VALSAT</a>';
    menuDiv.appendChild(siteSection);
    
    // 3. Scan the page headings to build a dynamic "Jump to section" drop-down
    var headers = document.querySelectorAll("main h2, main h3, main h4, body > h2, body > h3");
    var pageLinks = [];
    headers.forEach(function(header, index) {
        // Skip headers inside navigation elements, page footers, or maps
        if (header.closest("nav") || header.closest("header") || header.closest("#dati-accessibili") || header.closest("#mappa-sezione")) {
            return;
        }
        var text = header.textContent.trim();
        if (text.length > 0) {
            // Assign a unique id if not already present
            var id = header.getAttribute("id");
            if (!id) {
                id = "sec-" + index;
                header.setAttribute("id", id);
            }
            pageLinks.push({ text: text, id: id });
        }
    });
    
    // If sections are found, append a dropdown selector
    if (pageLinks.length > 0) {
        var pageSection = document.createElement("div");
        pageSection.className = "nav-section";
        
        var select = document.createElement("select");
        select.style.padding = "4px 8px";
        select.style.borderRadius = "4px";
        select.style.border = "1px solid #445577";
        select.style.backgroundColor = "#334466";
        select.style.color = "#ffffff";
        select.style.fontSize = "0.9rem";
        select.style.maxWidth = "200px";
        
        var defOption = document.createElement("option");
        defOption.text = "In questa pagina...";
        defOption.value = "";
        select.add(defOption);
        
        pageLinks.forEach(function(link) {
            var option = document.createElement("option");
            // Truncate option labels if they are too long
            option.text = link.text.length > 30 ? link.text.substring(0, 27) + "..." : link.text;
            option.value = "#" + link.id;
            select.add(option);
        });
        
        select.onchange = function() {
            if (this.value) {
                window.location.hash = this.value;
            }
        };
        
        var labelSpan = document.createElement("span");
        labelSpan.className = "nav-section-title";
        labelSpan.textContent = "Sezione:";
        
        pageSection.appendChild(labelSpan);
        pageSection.appendChild(select);
        menuDiv.appendChild(pageSection);
    }
    
    nav.appendChild(menuDiv);
    
    // Inject at the very top of body
    document.body.insertBefore(nav, document.body.firstChild);
});
