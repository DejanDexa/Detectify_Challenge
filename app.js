"use strict";

   let currentPage = 0;
   let itemsPerPage = 3;
   let lastIteration = 0;
   let cardItems;

   //Function that will filter and select items
   function paginate(items, page) {
        let start = itemsPerPage * page;
        let filterValue = document.getElementById('search').value

        //filter elements by search value
        let filteredItems = items.filter(item => 
                            item.title.toLowerCase().includes(filterValue.toLowerCase()) ||
                            item.description.toLowerCase().includes(filterValue.toLowerCase()) ||
                            item.date.toLowerCase().includes(filterValue.toLowerCase()))
        
        //Filter items by active type filter (All, Online or Live)
        let elementAllFilter = document.getElementById("all");
        let elementOnlineFilter = document.getElementById("online");
        let filterType;

        if (elementAllFilter.classList.contains('btn-warning')) {
            filterType = (item) => item.type.toLowerCase().includes('online') || item.type.toLowerCase().includes('live')
        } else if (elementOnlineFilter.classList.contains('btn-warning')) {
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

        if (items.length > 0) {
            for (let i = 0; i < items.length; i++) {
                html += '<div class="card col-3 m-1 mx-auto shadow">' + 
                        '<div class="card-body">' +
                            '<h6 class="card-info float-left">'+ items[i].date + '</h6>' +
                            '<h6 class="card-date float-right">'+ items[i].country + '</h6>' +
                            '<hr class="mt-3 mb-3"/>' +
                            '<h5 class="card-title text-left">'+ items[i].title +'</h5>' +
                            '<p class="card-text"> '+ items[i].description +'</p>' + 
                            '<a href="#" class="card-link float-right">Read more</a>' +
                        '</div>' +
                      '</div>';
            }
        } else {
            html = '<div class="card col-3 m-1 mx-auto shadow">' + 
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
        .then((res) => {
            return res.json();
        })
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
        toggleActiveFilter(elementAll)
        setInactiveFilter(elementOnline)
        setInactiveFilter(elementLive)
        currentPage = 0
        renderItems(paginate(cardItems, currentPage))
    });

    let elementOnline = document.getElementById("online");
    elementOnline.addEventListener('click', function () {
        toggleActiveFilter(elementOnline)
        setInactiveFilter(elementAll)
        setInactiveFilter(elementLive)
        currentPage = 0
        renderItems(paginate(cardItems, currentPage))
    });

    let elementLive = document.getElementById("live");
    elementLive.addEventListener('click', function () {
        toggleActiveFilter(elementLive)
        setInactiveFilter(elementAll)
        setInactiveFilter(elementOnline)
        currentPage = 0
        renderItems(paginate(cardItems, currentPage))
    });

    function toggleActiveFilter(element) {
        if (element.classList.contains('btn-warning')) {
            element.classList.remove("btn-warning");
            element.classList.add("btn-outline-secondary");
        } else {
            element.classList.add("btn-warning");
            element.classList.remove("btn-outline-secondary");
        }
    }

    function setInactiveFilter (element) {
        if (element.classList.contains('btn-warning')) {
            element.classList.remove("btn-warning");
            element.classList.add("btn-outline-secondary");
        }
    }

    $(window).scroll(function() {
        if ($(window).scrollTop() > 10) {
            $('#nav-bar').addClass('shadow-sm');
        } else {
            $('#nav-bar').removeClass('shadow-sm');
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

    getData();


