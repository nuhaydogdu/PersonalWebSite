
//header kısmının üstten iniş js
window.onscroll = function () { scrollFunction() };

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.getElementById("header").style.top = "0";
  } else {
    document.getElementById("header").style.top = "-90px";
  }
}


//mobile menu animasyonu
const clickx = document.getElementById('pencet');

clickx.addEventListener('click', function () {
  clickx.classList.toggle('Diam');

  //sayfayı üsten aşağıya kaydırıyor
  if ($("#pencet").hasClass('Diam') == true) {
    $('.mobile-navbar').css({ "top": "0", "position": "fixed" });

  } else {
    $('.mobile-navbar').css({ "top": "-1000px", "position": "absolute" });
  }
});


//mobile-navbarı link e tıklayınca yukar kaydır  sonrasındada menu animasyonunu düzenle
$(document).ready(function () {
  const links = document.querySelector("#myLinks");
  const mobilebar = document.querySelector(".mobile-navbar");
  const clickx = document.getElementById('pencet')

  links.addEventListener('click', function (e) {
    const tgt = e.target;
    if (tgt.parentNode.classList.contains("menu-item")) {
      $('.mobile-navbar').css({ "top": "-1000px", "position": "absolute" });
      clickx.classList.toggle('Diam');
    }
  });
});



//Back To tOP BAR
var btn = $('.back-to-top');

$(window).scroll(function () {
  if ($(window).scrollTop() > 100) {
    btn.addClass('active');
  } else {
    btn.removeClass('active');
  }
});







//HAREKETLİ YAZI İÇİN
var TxtRotate = function (el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = "";
  this.tick();
  this.isDeleting = false;
};

TxtRotate.prototype.tick = function () {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.innerHTML = '<span class="wrap">' + this.txt + "</span>";

  var that = this;
  var delta = 300 - Math.random() * 100;

  if (this.isDeleting) {
    delta /= 2;
  }

  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === "") {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
  }

  setTimeout(function () {
    that.tick();
  }, delta);
};

window.onload = function () {
  var elements = document.getElementsByClassName("txt-rotate");
  for (var i = 0; i < elements.length; i++) {
    var toRotate = elements[i].getAttribute("data-rotate");
    var period = elements[i].getAttribute("data-period");
    if (toRotate) {
      new TxtRotate(elements[i], JSON.parse(toRotate), period);
    }
  }
  // INJECT CSS
  var css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid #666 }";
  document.body.appendChild(css);
};


/*--------------------------------------------------------------
# Back to top button
--------------------------------------------------------------*/

/**
 * Easy on scroll event listener
 */

//  let backtotop = select('.back-to-top')
// if (backtotop) {
//    const toggleBacktotop = () => {
//      if (window.scrollY > 100) {
//       backtotop.classList.add('active')
//     } else {
//        backtotop.classList.remove('active')
//     }
//    }
//    window.addEventListener('load', toggleBacktotop)
//   onscroll(document, toggleBacktotop)
// }




