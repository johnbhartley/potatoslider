(function($) {

	$.fn.potatoSlider = function( options ) {

		// defaults set here
		var defaults = $.extend({
			interval: 		5000,
			bullets: 		true,
			autoPlay: 		true,
			bulletClass: 	'slider-bullets',
			navClass: 		'slider-navigation',
			pauseOnHover: 	true,
		}, options);

		// set all the vars 
		var options 		= $.extend({}, defaults, options),
			slider 			= $(this),
			slides 			= slider.find('ul.slides'),
			sliderImgs		= slider.find('img'),
			sliderWidth 	= slider.width(),
			slideCount 		= sliderImgs.length,
			bullets 		= '',
			bulletClass		= '',
			navigation		= '',
			slideInterval 	= options.interval,
			autoPlay 		= options.autoPlay,
			totalWidth		= sliderImgs * slideCount,
			currentSlide 	= 1,
			timer 			= setInterval(autoRotate, slideInterval);

			/**
			 * Generate the navigation buttons
			 */

			function generateNav( navClass ) {

				// if a navigation class gets passed, toss it in
				// else just our basic classes
				
				if( navClass ) {
					navigation += '<ul id="pager" class="slider navigation ' + navClass +'">';
				} else {
					navigation += '<ul id="pager" class="slider navigation">';
				}
				
				navigation += '	<li data-direction="next" href="" class="next">Next</li>';
				navigation += ' <li data-direction="prev" href="" class="prev">Previous</li>';
				navigation += '</ul>';

				return navigation;
			}

			/**
			 * Creates the bullets that line the bottom of the slider
			 */

			function generateBullets( bulletClass ) {
				if( bulletClass ) {
					bullets += '<ul class="slider bullets ' + bulletClass + '">';
				}
				bullets += '<ul class="slider bullets">';

				
				// check to see how many slides there are
				// iterate over the for statement and create
				// a bullet to correspond to each slide
								
				for( b = 1; b <= slideCount; b++ ) {
					if( b === 1 ) {
						bullets += '<li class="active" data-slide="' + b + '"><a href="">Slide ' + b + '</a></li>';
					} else {
						bullets += '<li data-slide="' + b + '"><a href="">Slide ' + b + '</a></li>';
					}
				}

				// close off and return bullets
				bullets += '</ul>';

				return bullets;
			}
			
		// return the plugin
		return this.each( function() {

			// generate and append the navigation and bullets
			$( this ).append( generateNav() ).append( generateBullets() );

			// handler for going to the slide that corresponds with the bullets
			$( this ).find( '.bullets li' ).on('click', function( e ) {
				e.preventDefault();
				$('.bullets li').removeClass('active');
				$(this).addClass('active');
				slides.animate({

					// clean this math up // just calculates what 
					// margin to set the slider to
			        'margin-left': -1 * ( sliderWidth * ( $( this ).data( 'slide' ) -1 ) )
			      })
			}); // closes bullet handler

			// for prev/next buttons
			// on click grab the current slide and move to the next
			$( this ).find( '.navigation li' ).on( 'click', function() {
				var direction 		= $( this ).data( 'direction' ),
					sliderMargin 	= parseInt($( '.slides' ).css( 'margin-left' ), 10),
					margin 			= sliderWidth,
					newOffset		= 0;

				// what to do with the current slide # if 
				// direction is next or previous
				// also set the newOffset
				if( direction === 'next' ) {
					currentSlide += 1;
					newOffset = sliderMargin - margin;
				} else {
					currentSlide -= 1;
					newOffset = sliderMargin + margin;
				}

				// make the slider infinite
				// clicking previous if first slide takes you to the end
				// clicking next if last slide takes you to the beginning
				if( currentSlide === 0 && direction === 'prev') {
					currentSlide = slideCount;
					newOffset = -sliderWidth * (slideCount-1);
				} else if ( currentSlide - 1 === slideCount) {
					currentSlide = 1;
					newOffset = 0;
				}

				// also change the bullet that is active
				$('.bullets li').removeClass('active');
				$('.bullets li').eq(currentSlide-1).addClass('active');

				// run the sliding function
				slideToSlide(newOffset, slides);

			}); // closes prev/next buttons

			// pause on hover
			if(options.pauseOnHover === true) {
				$(slides).hover(function(ev){
				    clearInterval(timer);
				}, function(){
				    timer = setInterval( autoRotate, slideInterval);
				});
			}

			return timer;
			
		});

		// utility funtion for sliding the slides
		function slideToSlide(margin, slides) {
			slides.animate({
				'margin-left': margin + 'px'
			})
		}

		// leverage the click function already in use 
		// to keep the slider rotating
		function autoRotate() {
			$('.navigation li.next').trigger('click');
		}

	}

}(jQuery));

// instantiate the plugin
$( document ).ready( function() {
	$( '.slider' ).potatoSlider({
		pauseOnHover: false
	});
});