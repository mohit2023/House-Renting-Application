const starAll = document.getElementById('star-all');
const star1 = document.getElementById('star-1');
const star2 = document.getElementById('star-2');
const star3 = document.getElementById('star-3');
const star4 = document.getElementById('star-4');
const star5 = document.getElementById('star-5');
const reviewContainer = document.getElementById('reviewContainer');


function populateReviews(arr){
  reviewContainer.innerHTML = '';
  for(let review of house.reviews){
    if(!arr.includes(review.rating)){
      continue;
    }
    const container = document.createElement('div');
    container.classList.add('card');
    container.classList.add('mr-3');
    container.classList.add('my-3');
    let deleteBtn;
    if(currentUser && review.owner._id===currentUser._id){ 
      deleteBtn = `<form action="/houses/${house._id}/reviews/${review._id}?_method=DELETE" method="POST">
        <button class="btn btn-sm btn-danger">&#128465; Delete</button>
      </form>`;
    }
    container.innerHTML = `
    <div class="card-body">
      <h6 class="card-subtitle mb-2 text-muted">By ${review.owner.username}</h6>
      <p class="starability-result float-sm-right" data-rating="${review.rating}"></p>
      <p class="card-text">${review.description}</p>
      ${deleteBtn} 
    </div>
    `;
    reviewContainer.appendChild(container);
  }
  starAll.classList.remove('current-active');
  star1.classList.remove('current-active');
  star2.classList.remove('current-active');
  star3.classList.remove('current-active');
  star4.classList.remove('current-active');
  star5.classList.remove('current-active');
}


populateReviews([1,2,3,4,5]);
starAll.classList.add('current-active');

starAll.addEventListener('click',()=>{
  populateReviews([1,2,3,4,5]);
  starAll.classList.add('current-active');
});
star1.addEventListener('click',()=>{
  populateReviews([1]);
  star1.classList.add('current-active');
});
star2.addEventListener('click',()=>{
  populateReviews([2]);
  star2.classList.add('current-active');
});
star3.addEventListener('click',()=>{
  populateReviews([3]);
  star3.classList.add('current-active');
});
star4.addEventListener('click',()=>{
  populateReviews([4]);
  star4.classList.add('current-active');
});
star5.addEventListener('click',()=>{
  populateReviews([5]);
  star5.classList.add('current-active');
});