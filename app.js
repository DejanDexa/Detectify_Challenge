"use strict";

    const BREAKPOINT = 968;
    const DESKTOP_ITEMS_VISIBLE = 3;
    const MOBILE_ITEMS_VISIBLE = 1;

    let currentPage = 0;
    let itemsPerPage;
    let lastIteration = 0;
    let cardItems = [];

    window.addEventListener('resize', function() {
        renderItems(paginate(cardItems, currentPage))
    });

   //Function that will filter and select items
   function paginate(items, page) {
        itemsPerPage = window.innerWidth < BREAKPOINT ? MOBILE_ITEMS_VISIBLE : DESKTOP_ITEMS_VISIBLE
        let start = itemsPerPage * page;
        let filterValue = document.getElementById('search').value

        //filter elements by search value
        let filteredItems = items.filter(item => 
                            item.title.toLowerCase().includes(filterValue.toLowerCase()) ||
                            item.description.toLowerCase().includes(filterValue.toLowerCase()) ||
                            getCountryByName(item.country).toLowerCase().includes(filterValue.toLowerCase()) ||
                            item.country.toLowerCase().includes(filterValue.toLowerCase()) ||
                            item.date.toLowerCase().includes(filterValue.toLowerCase()))
        
        //Filter items by active type filter (All, Online or Live)
        let elementAllFilter = document.getElementById("all");
        let elementOnlineFilter = document.getElementById("online");
        let filterType;

        if (elementAllFilter.classList.contains('selected')) {
            filterType = (item) => item.type.toLowerCase().includes('online') || item.type.toLowerCase().includes('live')
        } else if (elementOnlineFilter.classList.contains('selected')) {
            filterType = (item) => item.type.toLowerCase().includes('online')
        } else {
            filterType = (item) => item.type.toLowerCase().includes('live')
        }

        if (filterType != undefined) {
            filteredItems = filteredItems.filter(filterType)
        }

        //Filter items by the month filter value
        let filterMonth;
        let monthFilterElement = document.getElementById("monthFilter");
        let monthFilterValue = monthFilterElement.options[monthFilterElement.selectedIndex].value;
        if (monthFilterValue != '') {
            filterMonth = (item) => item.date.includes(monthFilterValue)
        } 

        if (filterMonth != undefined) {
            filteredItems = filteredItems.filter(filterMonth)
        }

        //Handle the state for the next/prev buttons
        toggleNextPrevButtons(filteredItems)

        //Select corresponding number of items (3 items per iteration)
        return filteredItems.slice(start, start + itemsPerPage);
    }

    function toggleNextPrevButtons (filteredItems) {
        lastIteration = Math.round(filteredItems.length/itemsPerPage) 
        if (currentPage == 0) {
            document.getElementById('prev').style.display = "none";
        }
        if (currentPage > 0) {
            document.getElementById('prev').style.display = "";
        }
        if (currentPage == lastIteration - 1 || lastIteration == 0) {
            document.getElementById('next').style.display = "none";
        }
        if (currentPage < lastIteration - 1) {
            document.getElementById('next').style.display = "";
        }
    }

    //Function that will render items per iteration
    function renderItems (items) {
        let html = "";
        const cardWidth = window.innerWidth < BREAKPOINT ? 10 : 3;
        if (items.length > 0) {
            for (let i = 0; i < items.length; i++) {
                const eventDate = new Date(items[i].date);

                html += '<div class="card col-'+ cardWidth +' m-1 mx-auto shadow">' + 
                        '<div class="card-body">' +
                            '<h6 class="card-info float-left"><span>'+ eventDate.getShortMonthName() + ' ' + eventDate.getDay() +'</span> '+ eventDate.getFullYear() + '</h6>' +
                            '<h6 class="card-date float-right">'+ items[i].country + '</h6>' +
                            '<hr class="mt-3 mb-3"/>' +
                            '<h5 class="card-title text-left">'+ items[i].title +'</h5>' +
                            '<p class="card-text"> '+ items[i].description +'</p>' + 
                            '<a href="#" class="card-link">Read more  ➔</a>' +
                        '</div>' +
                      '</div>';
            }
        } else {
            html = '<div class="card col m-1 mx-auto shadow">' + 
                        '<div class="card-body">' +
                            '<h5 class="card-title text-left">Nope.</h5>' +
                            '<p class="card-text">No matches for that search. Sorry about that.</p>' +
                        '</div>' +
                    '</div>';
        }
        
        document.getElementById("cardDiv").innerHTML=html;
    }  

    //Fetch json data
    function getData() {
        fetch("json/detectify-conf-events.json")
        .then(async (res) => await res.json())
        .then((items) => {
            cardItems = items;

            //Set correct date format for all items
            convertDate(cardItems) 

            //Render all filtered and paginated items
            renderItems(paginate(items, currentPage))
        })         
    }

    function convertDate(items) {
        for (let i = 0; i < items.length; i++) {
            let currentDate = new Date(items[i].date);
            items[i].date = currentDate.getShortMonthName() + ' ' + currentDate.getDay() + ' ' + currentDate.getFullYear()
        }
    }

    document.getElementById('next').addEventListener('click', function () {
        currentPage++
        renderItems(paginate(cardItems, currentPage))
    });

    document.getElementById('prev').addEventListener('click', function () {
        currentPage--
        renderItems(paginate(cardItems, currentPage))
    });

    document.getElementById('monthFilter').addEventListener('change', function () {
        currentPage = 0
        renderItems(paginate(cardItems, currentPage))
    });

    document.getElementById('search').addEventListener('keyup', function () {
        currentPage = 0
        renderItems(paginate(cardItems, currentPage))
     });

    let elementAll = document.getElementById("all");
    elementAll.addEventListener('click', function (e) {
        toggleFilter(this);
        currentPage = 0
        renderItems(paginate(cardItems, currentPage))
    });

    let elementOnline = document.getElementById("online");
    elementOnline.addEventListener('click', function () {
        toggleFilter(this);
        currentPage = 0
        renderItems(paginate(cardItems, currentPage))
    });

    let elementLive = document.getElementById("live");
    elementLive.addEventListener('click', function () {
        toggleFilter(this);
        currentPage = 0
        renderItems(paginate(cardItems, currentPage))
    });


    //toggls the selected class when choosing a filter 
    //and removes the current selected
    function toggleFilter(element) {
        const currentSelected = document.querySelector('.btn.selected');
        
        if(currentSelected !== element)
            currentSelected.classList.remove('selected');
        element.classList.toggle('selected');
        
    }

    //debounce menthod for scroll
    function debounce(method, delay) {
        clearTimeout(method._tId);
        method._tId = setTimeout(function () {
            method();
        }, delay);   
    }
    
    //attach class with shadow on scroll
    function handleScroll() {
        if (window.scrollY > 10) {
            document.getElementById('nav-bar').classList.add('shadow-sm');
        } else {
            document.getElementById('nav-bar').classList.remove('shadow-sm');
        } 
    }    
    window.addEventListener("scroll", function () {
        debounce(handleScroll, 30);
    });

    //attach class on the button +/x mobile version menu
    const menuBtn = document.querySelector('.menu-btn');
    let menuOpen = false;
    menuBtn.addEventListener('click', () => {
        if(!menuOpen) {
            menuBtn.classList.add('open');
            menuOpen = true;
        } else {
            menuBtn.classList.remove('open');
            menuOpen = false;
        }
    });
    
    Date.prototype.monthNames = [
        "January", "February", "March",
        "April", "May", "June",
        "July", "August", "September",
        "October", "November", "December"
    ];
    
    Date.prototype.getMonthName = function() {
        return this.monthNames[this.getMonth()];
    };
    Date.prototype.getShortMonthName = function () {
        return this.getMonthName().substr(0, 3);
    };


    let countryNames = {
        "USA": "America",
        "UK": "England",
        "SE": "Sweden"
    };

    function getCountryByName (countryCode) {
        if (countryNames.hasOwnProperty(countryCode)) {
            return countryNames[countryCode];
        } else {
            return countryCode;
        }
    }

    

    getData();


