$(document).ready(function () {
  const simulateNav = $('.simulate__nav');
  const simulateSidebar = $('.simulate__sidebar');
  const simulateCanvas = $('.simulate__canvas');
  const clearSimulateCanvas = $('[data-clear=simulate-canvas]');
  const saveSimulateCanvas = $('[data-save=simulate-canvas]');

  function hideNodeOnClickOutsideTarget(e, node, hiddenNode) {
    $(e.target).is(node)
      ? hiddenNode.attr('data-hide', false)
      : hiddenNode.attr('data-hide', true);
  };

  $(document).click(e => {
    hideNodeOnClickOutsideTarget(e, $('.interactive-img'), $('.moveable-control-box'))
  })

  $('.product-card').click(e => {
    $(e.currentTarget).parent().find('._active').removeClass('_active');
    $(e.currentTarget).addClass('_active');

    if (simulateCanvas.find('.interactive-img')) {
      simulateCanvas.find('.interactive-img, .moveable-control-box').remove();
    }

    $('<img />', {
      src: e.currentTarget.dataset.src,
      class: 'interactive-img',
      'data-croffle-ref': 'targetRef',
    }).appendTo(simulateCanvas);

    /* drag / move / scale */
    const element$0 = $(`[data-croffle-ref='element$0']`).get(0);
    const targetRef = $(`[data-croffle-ref='targetRef']`).get(0);

    const moveableRef = new Moveable(element$0, {
      target: targetRef,
      draggable: true,
      scalable: true,
      rotatable: true,
      keepRatio: true,
      throttleDrag: 1,
      throttleScale: 0,
      throttleRotate: 0,

      snappable: true,
      bounds: {'left': 0, 'top': 0, 'right': 0, 'bottom': 0, 'position': 'css'},

    });

    moveableRef.on('drag', e => {
      e.target.style.transform = e.transform;

      $('.moveable-control-box').attr('data-hide', false)
    });
    moveableRef.on('scale', e => {
      e.target.style.transform = e.drag.transform;
    });
    moveableRef.on('rotate', e => {
      e.target.style.transform = e.drag.transform;
    });

    $('.moveable-control-box').attr('data-hide', true);
    /* !drag / move / scale */
  })

  clearSimulateCanvas.click(() => {
    simulateCanvas.find('.interactive-img, .moveable-control-box').remove();
    simulateSidebar.find('._active').removeClass('_active');
  });

  function convert() {
    simulateNav.attr('data-hide', true);
	
    let controlsWasHidden = false;
    if( simulateCanvas.find('.moveable-control-box:visible').length > 0 ){
      simulateCanvas.find('.moveable-control-box').hide();
      controlsWasHidden = true;
    }

    html2canvas(document.querySelector('.simulate__area'), {
      backgroundColor: '#3c3c3c',
      //scale: 2,
    }).then((canvas) => {
		canvas.toBlob(function (blob) {
			saveAs(blob, 'sample.png');
		});
		if( controlsWasHidden ){
			simulateCanvas.find('.moveable-control-box').show();
		}
    });

    simulateNav.attr('data-hide', false);
  }

  saveSimulateCanvas.bind('click', convert);
  /* !save canvas*/
});