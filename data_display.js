var fct = function(data){
		$('#tree-orga-tech').html('');
		var html = '';

		$.each(data.result, function(idx, elem){
			html+='<ul><div class="draggable data-level-0"><li id="orga0" data-id="'+ elem.id +'"><span><i class="icon-minus-sign"></i>'+ elem.name +'</span></li></div></ul>';
			$.each(elem.children, function(idx, elem){
				html+='<ul><div class="draggable data-level-1"><li data-id="'+ elem.id +'"><span><i class="icon-minus-sign"></i> '+ elem.name +'</span></li></div></ul>';
				$.each(elem.children, function(idx, elem){
					html+='<ul><div class="draggable data-level-2"><li><span><i class="icon-minus-sign"></i> '+ elem.name +'</span></li></div></ul>';
					$.each(elem.children, function(idx, elem){
						html+='<ul><div class="draggable data-level-3"><li><span><i class="icon-minus-sign"></i> '+ elem.name +'</span></li></div></ul>';
						$.each(elem.children, function(idx, elem){
							html+='<ul><div class="draggable data-level-4"><li><span><i class="icon-minus-sign"></i> '+ elem.name +'</span></li></div></ul>';
						});
					});
				});
			});
		});

		html+='</ul></div>';
		$('#tree-orga-tech').html(html);
		$('#new-orga-hierarchy').on('drop', function(event){
			dtpUtil.dropOrganisation(event, this);
		});
		$('.draggable').attr('draggable', 'true');		
		$('.draggable').on('dragstart', function(event, p2, p3, p4){
			console.log('##DRAG', this, event, p2, p3, p4);
			dtpUtil.dragOrganisation(event, true);
		});
	};
	dtpUtil.sendRequest('organisation', {ajx: 1, action: ''}, fct);
