export default ngModule => {

	ngModule.directive('ngThumb', function ngThumb($window) {
	    const helper = {
	        support: !!($window.FileReader && $window.CanvasRenderingContext2D),
	        isFile: (item) => {
	            return angular.isObject(item) && item instanceof $window.File;
	        },
	        isImage: (file) => {
	            const type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
	            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
	        }
	    };
		return {
	        restrict: 'A',
	        template: '<canvas class="image-preview"/>',
	        scope: {
	        	ngThumb: "=",
	        	width: "=?",
	        	height: "=?",
	        },
	        link: function(scope, element) {
	        	let canvas;

	            function onLoadImage() {
	                var width = scope.width || this.width / this.height * scope.height;
	                var height = scope.height || this.height / this.width * scope.width;
	                canvas.attr({ width: width, height: height });
	                canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
	            }
	            
	            function onLoadFile(event) {
	                var img = new Image();
	                img.onload = onLoadImage;
	                img.src = event.target.result;
	            }

	            function init(file) {
		            if (!helper.isFile(file)) return;
		            if (!helper.isImage(file)) return;
		            canvas = element.find('canvas');
		            var reader = new FileReader();
		            reader.onload = onLoadFile;
		            reader.readAsDataURL(file);
	            }

	            if (!helper.support) return;
	            
	            scope.$watch(
	            	function() { 
	            		return scope.ngThumb; 
	            	}, 
	            	function(newV) {
	            		if (newV) {
	            			init(newV);
	            		}
	            	}
	            );
			}
		};
	});
};
