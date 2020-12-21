const $exeBtn = document.querySelector("#js-exeBtn");
const $horInput = document.querySelector("#js-horInput");
const $verInput = document.querySelector("#js-verInput");
const $mineInput = document.querySelector("#js-mineInput");
const $tbody = document.querySelector("tbody");

let mineArray = [];
let mineLocation = [];

// 지뢰 심기
paintMine = (hor) => {
  for (let i = 0; i < mineLocation.length; i += 1) {
    const stripe = Math.floor(mineLocation[i] / hor);
    const rank = mineLocation[i] % hor;
    $tbody.children[stripe].children[rank].innerText = "X";
    mineArray[stripe][rank] = "X";
  }
};

// 지뢰 위치 정하기
minePlanting = (hor, ver, mineNum) => {
  const mine = new Array(hor * ver).fill().map((item, index) => {
    return index;
  });
  for (let i = 0; i < mineNum; i += 1) {
    mineLocation.push(
      mine.splice(Math.floor(Math.random() * mine.length), 1)[0]
    );
  }
  paintMine(hor);
};

// 깃발 꽂기
handleContextmenuTd = (e) => {
  e.preventDefault();
  const stripe = [...e.target.parentNode.parentNode.children].indexOf(
    e.target.parentNode
  );
  const rank = [...e.target.parentNode.children].indexOf(e.target);
  if (e.target.innerText === "" || e.target.innerText === "X") {
    e.target.innerText = "!";
  } else if (e.target.innerText === "!") {
    e.target.innerText = "?";
  } else if (e.target.innerText === "?") {
    if (mineArray[stripe][rank] === 0) {
      e.target.innerText = "";
    } else if (mineArray[stripe][rank] === "X") {
      e.target.innerText = "X";
    }
  }
};

// 지뢰 클릭시
gameOver = (e) => {
  const $land = document.querySelectorAll(".land");
  [...$land].forEach((item) => {
    item.removeEventListener("click", handleClickTd);
    item.removeEventListener("contextmenu", handleContextmenuTd);
  });
};

// 주변 지뢰 갯수 나타내기
handleClickTd = (e) => {
  if (e.target.innerText === "!" || e.target.innerText === "?") return;
  const stripe = [...e.target.parentNode.parentNode.children].indexOf(
    e.target.parentNode
  );
  const rank = [...e.target.parentNode.children].indexOf(e.target);
  let arroundMineArr = [
    mineArray[stripe][rank - 1],
    mineArray[stripe][rank + 1],
  ];
  if (mineArray[stripe - 1]) {
    arroundMineArr = arroundMineArr.concat([
      mineArray[stripe - 1][rank - 1],
      mineArray[stripe - 1][rank],
      mineArray[stripe - 1][rank + 1],
    ]);
  }
  if (mineArray[stripe + 1]) {
    arroundMineArr = arroundMineArr.concat([
      mineArray[stripe + 1][rank - 1],
      mineArray[stripe + 1][rank],
      mineArray[stripe + 1][rank + 1],
    ]);
  }
  const numOfMine = arroundMineArr.filter((item) => {
    return item === "X";
  }).length;
  if (mineArray[stripe][rank] === "X") {
    e.target.innerText = "💣";
    e.target.classList.add("checked");
    gameOver();
  } else {
    mineArray[stripe][rank] = 1;
    e.target.innerText = numOfMine || "";
    e.target.classList.add("checked");
  }
  // 지뢰갯수가 0개일 때, 주변 지뢰갯수 표시하기
  if (numOfMine === 0) {
    if (e.target.innerText === "💣") return;
    let arroundSquare = [];
    if ($tbody.children[stripe - 1]) {
      arroundSquare = arroundSquare.concat([
        $tbody.children[stripe - 1].children[rank - 1],
        $tbody.children[stripe - 1].children[rank],
        $tbody.children[stripe - 1].children[rank + 1],
      ]);
    }
    arroundSquare = arroundSquare.concat([
      $tbody.children[stripe].children[rank - 1],
      $tbody.children[stripe].children[rank + 1],
    ]);
    if ($tbody.children[stripe + 1]) {
      arroundSquare = arroundSquare.concat([
        $tbody.children[stripe + 1].children[rank - 1],
        $tbody.children[stripe + 1].children[rank],
        $tbody.children[stripe + 1].children[rank + 1],
      ]);
    }
    const newArroundSquare = [];
    arroundSquare = arroundSquare.forEach((item) => {
      if (item === undefined) return;
      if (!item.classList.contains("checked")) {
        const index = arroundSquare.indexOf(item);
        newArroundSquare.push(arroundSquare[index]);
      }
    });
    newArroundSquare.forEach((item) => {
      if (item === undefined) return;
      item.click();
    });
  }
};

handleClickExeBtn = () => {
  $tbody.innerHTML = "";
  mineArray = [];
  mineLocation = [];
  const hor = parseInt($horInput.value);
  const ver = parseInt($verInput.value);
  console.log(hor, ver);
  const mineNum = parseInt($mineInput.value);
  for (let i = 0; i < ver; i += 1) {
    const verArray = [];
    mineArray.push(verArray);
    const tr = document.createElement("tr");
    for (let j = 0; j < hor; j += 1) {
      verArray.push(0);
      const td = document.createElement("td");
      td.addEventListener("contextmenu", handleContextmenuTd);
      td.addEventListener("click", handleClickTd);
      td.classList.add("land");
      tr.appendChild(td);
    }
    $tbody.appendChild(tr);
  }
  console.log(mineArray);
  minePlanting(hor, ver, mineNum);
};

function init() {
  $exeBtn.addEventListener("click", handleClickExeBtn);
}

init();
