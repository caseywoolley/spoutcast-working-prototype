'use strict'

angular.module('spoutCastApp')
.directive('searchBar', [
    () => {
    return {
        scope: {
            ngModel: '='
        },
        require: ['?ngModel'],
        restrict: 'E',
        replace: true,
        template: `<div class="item item-input-inset">
                        <label class="item-input-wrapper">
                            <i class="icon ion-ios-search-strong placeholder-icon"></i>
                            <input type="search"
                                   placeholder="Search"
                                   ng-model="ngModel.text">

                            <a ng-if="ngModel.text != ''"
                               on-touch="ngModel.text=''">

                                <i class="icon ion-ios-close placeholder-icon"></i>
                            </a>
                        </label>
                    </div>
                    `,

        link: (scope, element, attrs)=>{

        }
    };
}]);