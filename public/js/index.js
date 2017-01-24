(function() {
	var isSession = false;
	$( document ).ready(bindEvents);

	function bindEvents() {
		$('.tweet-action').on('click', tweetClicked)
		$('.suggest-button').on('click', suggestFormFilled);
		$('.tweet-now').on('click', tweetNowClicked);

		isSession = $('#sessionHolder').length;
	}

	function handleTweetError(error) {

	}

	function tweetNowClicked() {

		if (isSession) {
			var $scope = $(this),
				tweetId = $scope.attr('data-tweet-id');

			$.ajax({
				url: '/tweets/send',
				method: 'POST',
				data: { 'tweetId': tweetId },
				success: function (response) {
					if ('success' in response) {

					} else if ('error' in response) {
						handleTweetError(response.error);
					}
					/*TweetResult {
  user: 
   { id: 1,
     twitterId: '3117167634',
     name: 'Richmond Watkins',
     twitterName: 'richmondwatkins',
     twitterProfileUrl: 'https://t.co/fzAFmpwByb',
     accessToken: '3117167634-SKrtobZ2WGhQ0ahbi9gOb6WLwKI6uJfdkLTMe9W',
     accessTokenSecret: 'XCOWPNb7i3hjyUsE9mi4kH8CXYJjcqaV6jWE0EpXUrwll',
     created_at: Mon Jan 23 2017 22:48:56 GMT-0800 (PST),
     updated_at: Mon Jan 23 2017 22:48:56 GMT-0800 (PST),
     deleted_at: null },
  error: 
   { statusCode: 403,
     data: '{"errors":[{"code":187,"message":"Status is a duplicate."}]}' } }*/

					//Object {user: Object, success: "{"created_at":"Tue Jan 24 06:53:56 +0000 2017","id…,"favorited":false,"retweeted":false,"lang":"en"}"}
					//Object {error: "Something went wrong. Refresh and try again."}
					console.log('response');
					console.log(response);
				},
				error: function (jqXHR, exception) {
					console.log('exception');
					console.log(exception);
				}
			});

		} else {
			handleModel();
		}
	}

	function tweetClicked() {
		var $scope = $(this);
		var isJoined = $scope.hasClass('tweet-leave'),
			tweetIds = [$scope.attr('data-tweet-id')],
			method = isJoined ? 'DELETE' : 'POST';

		if (isSession) {
			if (isJoined) {
				$scope.addClass('tweet-join');
				$scope.removeClass('tweet-leave');
				$scope.text('Join');
			} else {
				$scope.addClass('tweet-leave');
				$scope.removeClass('tweet-join');
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