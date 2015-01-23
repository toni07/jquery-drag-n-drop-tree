getHashData: function(){

	    var windowHash = window.location.hash;
        var windowHashList = windowHash.replace('#', '').split('&');
        var urlKeyValList = [];
        for(i=0; i<windowHashList.length; i++){
            var keyVal = windowHashList[i].split('=');
            console.log('hash: ' + keyVal[0] + ' -- ' + keyVal[1]);
            urlKeyValList[keyVal[0]] = keyVal[1];
        }
        return urlKeyValList;
        /*if(null != urlKeyValList['mode'] && 1 == urlKeyValList['mode']){	//mode expert
        }*/
	},
	
	domElem: function(id){
		return document.getElementById(id);
	},
	
	dragOrganisation: function(ev, isNewElement){
		var orgaId = $(ev.target).attr('data-id');
		dtpUtil.draggedElement = {
			elem: ev.target,
			isNew: isNewElement
		};
		console.log('##ev.target', orgaId);
		ev.originalEvent.dataTransfer.setData('Text', orgaId);
	},
	
	dropOrganisation: function(ev, targetElem){
	
		var elementClonesBeforeError = dtpUtil.getClonedElements();
		targetElem = $(targetElem);
		var newElem = dtpUtil.dropOrganisationPhase1(ev, targetElem);
		//.after('<hr class="hr-drop" ondragover="dtpUtil.dragOrganisationBetweenTwo(event, this);" ondragleave="dtpUtil.undragOrganisationBetweenTwo(event, this);" ondrop="dtpUtil.dropOrganisationBetweenTwo(event, this);" />');
		try{
			var newUl = targetElem.find('ul');
			if(0 == newUl.length){
				newUl = $('<ul>');
			}
			else if(newUl.length > 1){
				console.log('##newUl', newUl);
				newUl = $(newUl[0]);
			}
			targetElem.append(newUl);
			newUl.append(newElem);
			//newElem.append('<input name="new_orga" type="hidden" value="'+ elemLevel +'_'+ idParent +'_'+ idOrganisation+'" />');
			dtpUtil.rebuildTree();
		}
		catch(e){
			console.log('##error', elementClonesBeforeError, e);
			$('#new-orga-hierarchy').empty();
			$.each(elementClonesBeforeError, function(itr, elem){
				$('#new-orga-hierarchy').append(elem);
			});
			
		}
	},
	
	getClonedElements: function(){
		var elementsBeforeError = $('#new-orga-hierarchy').children();
		var elementClonesBeforeError = [];
		elementsBeforeError.each(function(itr, elem){
			elementClonesBeforeError.push($(elem).clone(true));
		});
		return elementClonesBeforeError;
	},
	
	dropOrganisationPhase1: function(ev, targetElem){
		
		ev.preventDefault();
		ev.stopPropagation();
		dtpUtil.undragOverOrganisation(ev, targetElem);
		//var elementsBeforeError = dtpUtil.domElem('new-orga-hierarchy').getElementsByTagName('*');
		var idOrganisation = ev.originalEvent.dataTransfer.getData('Text');
		var idParent = targetElem.attr('data-id');
		var levelParent = targetElem.attr('data-level');
		var newElem;
		var elemToManage = dtpUtil.draggedElement.elem;
		var isNewElement = dtpUtil.draggedElement.isNew;
		if(isNewElement){
			newElem = $(elemToManage).clone(true);
			var newDiv = $('<div>');
			newDiv.addClass('drop-between-elements');
			newDiv.on('dragover', function(event){
				console.log('##dragover div');
				dtpUtil.dragOverOrganisation(event, this);
			});
			newDiv.on('dragleave', function(event){
				dtpUtil.undragOverOrganisation(event, this);
			});
			newDiv.on('drop', function(event){
				dtpUtil.dropOrganisationBetweenTwo(event, this);
			});
			newElem.prepend(newDiv);
		}
		else{
			newElem = $(elemToManage);
		}
		newElem.on('dragstart', function(event, p2, p3, p4){
			dtpUtil.dragOrganisation(event, false);
		});
		newElem.on('dragover', function(event, p2, p3, p4){
			//dtpUtil.dragOverOrganisation(event, this);
		});
		newElem.on('dragleave', function(event, p2, p3, p4){
			//dtpUtil.undragOverOrganisation(event, this);
		});
		
		newElem.on('drop', function(event, p2, p3, p4){
			dtpUtil.dropOrganisation(event, this);
		});
		var elemLevel = 1*levelParent + 1;
		/*newElem.attr('data-level', elemLevel);
		newElem.removeClass();
		newElem.addClass('draggable data-level-' + elemLevel);*/
		newElem.aaParentElement = targetElem;
		return newElem;
	},
	
	dropOrganisationBetweenTwo: function(ev, targetElem){
		
		targetElem = $(targetElem);
		//get the parent of the div we dropped to
		targetElem = targetElem.parent('div');
		var ulParent = targetElem.parent('ul');
		var elementClonesBeforeError = dtpUtil.getClonedElements();
		var newElem = dtpUtil.dropOrganisationPhase1(ev, targetElem);
		try{
			var newUl = targetElem.find('ul');
			if(0 == newUl.length){
				newUl = $('<ul>');
			}
			else if(newUl.length > 1){
				console.log('##newUl', newUl);
				newUl = $(newUl[0]);
			}
			newElem.insertBefore(targetElem);
		}
		catch(e){
			console.log('##error', elementClonesBeforeError, e);
			$('#new-orga-hierarchy').empty();
			$.each(elementClonesBeforeError, function(itr, elem){
				$('#new-orga-hierarchy').append(elem);
			});
			
		}
	},
	
	/*dropOrganisation: function(ev, elem){
	
		return dtpUtil.dropOrganisationCommon(ev, elem);
		var idOrganisation = ev.dataTransfer.getData('Text');
		var newElem;
		var elemToManage = dtpUtil.draggedElement.elem;
		var isNewElement = dtpUtil.draggedElement.isNew;
		if(isNewElement){
			newElem = $(elemToManage).clone();
			var newDiv = $('<div>');
			newDiv.css('width', '300px');
			newDiv.css('height', '2px');
			newDiv.on('dragover', function(event){
				console.log('##dragover div');
				dtpUtil.dragOverOrganisation(event, this);
			});
			newDiv.on('dragleave', function(event){
				dtpUtil.undragOverOrganisation(event, this);
			});
			
			newDiv.on('drop', function(event){
				dtpUtil.dropOrganisation(event, this);
			});
			newElem.append(newDiv);
			console.log('##new div');
		}
		else{
			newElem = $(elemToManage);
		}
		newElem.on('dragstart', function(event, p2, p3, p4){
			dtpUtil.dragOrganisation(event, false);
		});
		newElem.attr('data-level', '0');
		newElem.on('drop', function(event, p2, p3, p4){
			dtpUtil.dropOrganisation(event, this);
		});
		newElem.removeClass();
		newElem.addClass('draggable');
		newElem.aaParentElement = null;
		var idParent = 0;
		var elemLevel = 0;
		var targetElem = $('#new-orga-hierarchy');
		var newUl = targetElem.children('ul');
		if(0 == newUl.length){
			newUl = $('<ul>');
		}
		targetElem.append(newUl);
		newUl.append(newElem);
		dtpUtil.rebuildTree();
	},*/
	
	/**
	 * @function 
	 * this builds a real tree (with <li> children) as when we move a new element, we want to move its children too
	*/
	/*dropOrganisationOnItem: function(ev, targetElem){
		return dtpUtil.dropOrganisationCommon(ev, targetElem);
		ev.preventDefault();
		ev.stopPropagation();
		targetElem = $(targetElem);
		dtpUtil.undragOverOrganisation(ev, targetElem);
		//var elementsBeforeError = dtpUtil.domElem('new-orga-hierarchy').getElementsByTagName('*');
		var elementsBeforeError = $('#new-orga-hierarchy').children();
		var elementClonesBeforeError = [];
		elementsBeforeError.each(function(itr, elem){
			elementClonesBeforeError.push($(elem).clone(true));
		});
		console.log('##dropOrganisationOnItem', ev, targetElem, elementsBeforeError);
		var idOrganisation = ev.originalEvent.dataTransfer.getData('Text');
		var idParent = targetElem.attr('data-id');
		var levelParent = targetElem.attr('data-level');
		var newElem;
		var elemToManage = dtpUtil.draggedElement.elem;
		var isNewElement = dtpUtil.draggedElement.isNew;
		if(isNewElement){
			newElem = $(elemToManage).clone();
			var newDiv = $('<div>');
			newDiv.css('width', '300px');
			newDiv.css('height', '2px');
			newDiv.css('padding', '2 0');
			newDiv.on('dragover', function(event){
				console.log('##dragover div');
				dtpUtil.dragOverOrganisation(event, this);
			});
			newDiv.on('dragleave', function(event){
				dtpUtil.undragOverOrganisation(event, this);
			});
			newDiv.on('drop', function(event){
				dtpUtil.dropOrganisationBetweenTwo(event, this);
			});
			newElem.prepend(newDiv);
		}
		else{
			newElem = $(elemToManage);
		}
		newElem.on('dragstart', function(event, p2, p3, p4){
			dtpUtil.dragOrganisation(event, false);
		});
		newElem.on('dragover', function(event, p2, p3, p4){
			dtpUtil.dragOverOrganisation(event, this);
		});
		newElem.on('dragleave', function(event, p2, p3, p4){
			dtpUtil.undragOverOrganisation(event, this);
		});
		
		newElem.on('drop', function(event, p2, p3, p4){
			dtpUtil.dropOrganisation(event, this);
		});
		var elemLevel = 1*levelParent + 1;
		//newElem.attr('data-level', elemLevel);
		//newElem.removeClass();
		//newElem.addClass('draggable data-level-' + elemLevel);
		newElem.aaParentElement = targetElem;
		//.after('<hr class="hr-drop" ondragover="dtpUtil.dragOrganisationBetweenTwo(event, this);" ondragleave="dtpUtil.undragOrganisationBetweenTwo(event, this);" ondrop="dtpUtil.dropOrganisationBetweenTwo(event, this);" />');
		try{
			var newUl = targetElem.find('ul');
			if(0 == newUl.length){
				newUl = $('<ul>');
			}
			else if(newUl.length > 1){
				console.log('##newUl', newUl);
				newUl = $(newUl[0]);
			}
			targetElem.append(newUl);
			newUl.append(newElem);
			//newElem.append('<input name="new_orga" type="hidden" value="'+ elemLevel +'_'+ idParent +'_'+ idOrganisation+'" />');
			dtpUtil.rebuildTree();
		}
		catch(e){
			console.log('##error', elementClonesBeforeError, e);
			$('#new-orga-hierarchy').empty();
			$.each(elementClonesBeforeError, function(itr, elem){
				$('#new-orga-hierarchy').append(elem);
			});
			
		}
	},*/
	
	dragOverOrganisation: function(ev, elem){
		ev.preventDefault();
		ev.stopPropagation();
		$(elem).css('background-color', '#00ff00');
	},
	
	undragOverOrganisation: function(ev, elem){
		ev.preventDefault();
		ev.stopPropagation();
		$(elem).css('background-color', '#ffffff');
	},
	
	rebuildTree: function(){
		var firstLevel = 0;
		var currentTheoricalLevel = 0;
		var previousLevel = 0;
		var isRoot = false;
		$('#new-orga-hierarchy .draggable').each(function(itr, elem){
			/*if((0 == itr){
				isRoot = true;
			}
			var currentLevelFound = 1*elem.attr('data-level');
			if(currentLevelFound < previousLevel){
				isRoot = true;
			}
			//all the roots have to have a 0 level
			if(isRoot){
				currentTheoricalLevel = 0;
				elem.attr('data-level', currentTheoricalLevel);
				elem.removeClass();
				elem.addClass('draggable data-level-' + currentTheoricalLevel);
			}
			else{
				//all the other elements have to have a (parent level + 1) level
				currentTheoricalLevel = 
				if(currentTheoricalLevel){
				}
			}*/
			
			
			
			previousLevel = currentTheoricalLevel;
			/*elem = $(elem);
			var currentLevelFound = 1*elem.attr('data-level');
			console.log('##rebuildTree', elem, currentLevelFound, currentLevel);
			
			if((0 == itr && 0 != currentLevelFound) || !(currentLevelFound == currentLevel || currentLevelFound == currentLevel + 1)){	//we have to descend all levels
				if(0 != currentLevelFound){
					currentLevel = currentLevelFound - 1;
					elem.attr('data-level', currentLevelFound);
				}
				elem.removeClass();
				elem.addClass('draggable data-level-' + currentLevel);
				console.log('##drop level');
			}
			currentLevel = 1*elem.attr('data-level');*/
		});
	},
	
	dragOrganisationBetweenTwo: function(ev, elem){
	},
	
	undragOrganisationBetweenTwo: function(ev, elem){
	},
				
	allowDropOrganisation: function(ev){
		ev.preventDefault();
	},
	
	postNewOrganisation: function(elem){
		var contentDiv = $($(elem).parents('form').children('div')['0']);
		contentDiv.find('input').remove();
		var rootElements = contentDiv.children('ul');
		console.log('##rootElements', rootElements);
		$.each(rootElements, function(it, elem){
			dtpUtil.parseNewElement(elem, 0);
		});
		var params = $(elem).parents('form').serializeArray();
		console.log('##postNewOrganisation', params);
	},
	
	parseNewElement: function(element, level){
		var childrenDiv = $(element).children('div');
		console.log('##childrenDiv', childrenDiv, level);
		level++;
		$.each(childrenDiv, function(it, childDiv){
			var childrenLi = $(childDiv).children('li');
			var childrenUl = $(childDiv).children('ul');
			console.log('##childrenLi', childrenLi);
			$.each(childrenLi, function(it, elem){
				elem = $(elem);
				var idElem = elem.attr('data-id');
				var newInput = $('<input>');
				newInput.attr('type', 'hidden');
				newInput.attr('name', 'toto');
				newInput.attr('value', level + '_' + idElem + '_' + elem.text());
				$(elem).append(newInput);
				//console.log('##append', elem, dtpUtil.randomFromInterval(0, 10000), level);
				//dtpUtil.parseNewElement(elem, level);
			});
			$.each(childrenUl, function(it, elem){
				dtpUtil.parseNewElement(elem, level);
			});
		});
	},
	
	randomFromInterval: function(from,to){
		return Math.floor(Math.random()*(to-from+1)+from);
	}
