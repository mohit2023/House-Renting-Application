const form = document.getElementById('searchForm');
const housesContainer = document.getElementById('housesContainer');


function populateHouses(min,max){
  housesContainer.innerHTML = '';
  for(let house of houses.features){
    if(min!="" && +house.rent<min){
      continue;
    }
    if(max!=="" && +house.rent>max){
      continue;
    }
    const container = document.createElement('div');
    container.classList.add('card');
    container.classList.add('mb-4');
    container.classList.add('shadow');

    let imgDivText;
    if(house.images.length>0){ 
      imgDivText = `<img class="img-fit" alt="" src="${house.images[0].url}">`;
    }else{ 
      imgDivText = `<img class="img-fit" src="/images/noHouseImg.png" alt="">`
    }
    let address = `${house.address.line1},<br>`;
    if(house.address.line2){address+= `${house.address.line2}, <br>`;} 
    address+=`${house.address.city}, ${house.address.state}, <br>${house.address.country} -${house.address.postalCode}</br>`;
    container.innerHTML = `
    <div class="row">
        <div class="col-sm-5 d-flex flex-column justify-content-center align-items-center">
            <div class="img-container">`+
                imgDivText+ 
            `</div>
        </div>
        <div class="col-sm-7">
            <div class="card-body">
                <h5 class="card-title">House Owner's Name: ${house.name}</h5>
                <small class="text-muted">Rent per month: &#8377;${house.rent}</small>
                <p class="card-text">
                  ${address}
                </p>
                <a class="btn btn-primary" href="/houses/${house._id}">Show Details</a>
            </div>
        </div>
    </div>
    `;

    housesContainer.appendChild(container);
  }
};


function formfilter(evt){
  evt.preventDefault();

  populateHouses(minRent.value,maxRent.value);
};


populateHouses();

form.addEventListener('submit',formfilter);