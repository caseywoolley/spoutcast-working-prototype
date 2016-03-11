'use strict'

angular.module('spoutCastApp')
.service('ReviewService', function() {

    var currentReview = {};

    var getCurrentReview = function(){ return currentReview; };
    var setCurrentReview = function(review){ currentReview = review; };
    var clearCurrentReview = function(){ currentReview = {}; };
    var updateCurrentReview = function(updates) {
    	_.extend(currentReview, updates);
    	return currentReview;
    };

    return {
      getCurrentReview: getCurrentReview,
      setCurrentReview: setCurrentReview,
      clearCurrentReview: clearCurrentReview,
      updateCurrentReview: updateCurrentReview
    };
});