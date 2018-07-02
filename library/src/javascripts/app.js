global.jQuery = require('jquery');
const $ = jQuery;
const flexibility = require('flexibility');
const Granim = require('granim');
const WebMidi = require('webmidi');
const screenfull = require('screenfull');

// preview and test
function preview() {
	WebMidi.enable(function(err) {
		let inputList;
		for (let i = 0; i < WebMidi.inputs.length; i++) {
			inputList = '<div class="input">';
			inputList += WebMidi.inputs[i].name;
			inputList += '</div>';
			$('.midi').append(inputList);
		}
		let input = WebMidi.getInputByName($('.data').data('input'));
		input.addListener('noteon', 'all', function(e) {
			let note = e.note.name + e.note.octave;
			window.alert(note);
		});
	});
	$.getJSON($('.data').data('url'), function(data) {
		let track;
		for (let i = 0; i < Object.keys(data).length; i++) {
			track = '<div class="track">';
			track +=
				'<h3 class="track__title">' + Object.keys(data)[i] + '</h3>';
			track +=
				'<canvas id="track__gradient--' +
				i +
				'" class="track__gradient"></canvas>';
			track += '</div>';
			$('.preview').append(track);
			new Granim({
				element: '#track__gradient--' + i,
				name: 'granim',
				opacity: [1, 1],
				states: {
					'default-state': {
						gradients: Object.values(data)[i].gradients,
						transitionSpeed: 7000
					}
				}
			});
		}
	});
}

// live
function live() {
	$.getJSON($('.data').data('url'), function(data) {
		// init Granim
		const granimInstance = new Granim({
			element: '#canvas-interactive',
			name: 'interactive-gradient',
			elToSetClassOn: '.canvas-interactive-wrapper',
			direction: 'diagonal',
			opacity: [1, 1],
			isPausedWhenNotInView: true,
			stateTransitionSpeed: 5000,
			states: data
		});

		// init WebMidi
		WebMidi.enable(function(err) {
			if (err) {
				console.log('WebMidi could not be enabled.', err);
			} else {
				let input = WebMidi.getInputByName($('.data').data('input'));
				// receive midi
				input.addListener('noteon', 'all', function(e) {
					let note = e.note.name + e.note.octave;

					// change gradient
					$.getJSON($('.data').data('midi'), function(data) {
						let obj = data.filter(function(midi) {
							return midi.midi == note;
						});
						if (obj.length !== 0) {
							let name = Object.values(obj[0])[0];
							granimInstance.changeState(name);
						}
					});
				});
			}
		});
	});

	// fullscreen
	$('.live__zone').click(function() {
		if (screenfull.enabled) {
			screenfull.request();
		}
	});
}

$(document).ready(() => {
	if ($('.preview').length) {
		preview();
	} else {
		live();
	}
});
