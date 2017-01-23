(function() {
	var isSession = false;
	$( document ).ready(bindEvents);

	function bindEvents() {
		$('.tweet-action').on('click', tweetClicked)
		$('.suggest-button').on('click', suggestFormFilled);

		isSession = $('#sessionHolder').length;
	}

	function tweetClicked() {
		var $scope = $(this);
		var isJoined = $scope.hasClass('tweet-leave'),
			tweetIds = [$scope.attr('data-tweet-id')],
			method = isJoined ? 'DELETE' : 'POST';

		if (isSession) {
			if (isJoined) {
				$scope.removeClass('tweet-leave');
				$scope.text('Join');
			} else {
				$scope.addClass('tweet-leave');
				$scope.text('Leave');
			}

			$.ajax({
				url: '/tweets/subscribe',
				method: method,
				data: { 'tweetIds[]': tweetIds},
				success: function (response) {
			        
			    },
			    error: function (jqXHR, exception) {
		    	//#error
					var model = $('#error'),
					$modelBackground = $('.modal'),
					$modelClose = $('.modal-close');

					model.addClass('is-active');

					var dimiss = function() {
						$modelBackground.removeClass('is-active');
					};

					$modelBackground.on('click', dimiss);
					$modelClose.on('click', dimiss);
			    }
			}).done(function() {
			});
		} else {
			handleModel();
		}
	}

	function handleModel() {
		var model = $('#twitter-signup'),
			$modelBackground = $('.modal'),
			$modelClose = $('.modal-close');

			model.addClass('is-active');

		var dimiss = function() {
			$modelBackground.removeClass('is-active');
		};

		$modelBackground.on('click', dimiss);
		$modelClose.on('click', dimiss);
	}

	function suggestFormFilled() {
		console.log('hit');
		var textArea = $('#suggest-form');
		var content = textArea.val();

		if (content.length) {
			var $this = $(this);

			$this.addClass('is-loading');
			textArea.val('');

			$.ajax({
				url: '/tweets/suggest',
				method: 'POST',
				data: { 'message': content}
			}).done(function() {
				$this.removeClass('is-loading');
			});
		}
	}
})()