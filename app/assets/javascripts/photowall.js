$(function(){
	//var empJSON;
	
	var allroles = [];
	var uniqueroles = [];
	var role_selected = [];
	
	var allprojects = [];
	var uniqueprojects = [];

	$.getJSON('/consultants', function(data) {
		empJSON = data;
		generateDropdowns();
		generateData();
	});

    $.get('/activity', function(data) {
        $('#activityFeed').html(data);
    });
	
	generateDropdowns = function(){
		$.each(empJSON, function(index){
			allroles.push(empJSON[index]['role']);
			allprojects.push(empJSON[index]['currentproject']);	
		});
		
		$.each(allroles, function(index, element){
//			console.log(index + " -- " + allroles[index]);
			if ($.inArray(element, uniqueroles) === -1)
			{
				 uniqueroles.push(element);
				 $("#dropdown_role").append("<li><a href='javascript:void(0)'>" + element + "</a></li>");		
			}
		});
		
		$("#dropdown_role").prepend("<li><a href='javascript:void(0)'>All Roles</a></li>");		
		
		$("#dropdown_role li a").bind("click", function(){
			filterRole.apply(this);	
		});
		
		$.each(allprojects, function(index, element){
			if ($.inArray(element, uniqueprojects) === -1)
			{
				 uniqueprojects.push(element);
				 $("#dropdown_project").append("<li><a href='javascript:void(0)'>" + element + "</a></li>");		
			}
		});	
		
		$("#dropdown_project").prepend("<li><a href='javascript:void(0)'>All Projects</a></li>");		
		
		$("#dropdown_project li a").bind("click", function(){
			filterProject.apply(this);	
		});
			
	}
	
	generateData = function(){
		var filterRole = $("#filter_role a.sel").text().split("Showing ")[1];
		var filterProject = $("#filter_project a.sel").text().split("Showing ")[1];
		var sortby = $(".sort_panel a.sel").text().split("Sorted by ")[1];
		sortby = sortby.toLowerCase();
//		console.log(filterRole +  " --- " + sortby);
		
		if (filterRole != "All Roles")
		{ 
			role_selected = [];
			role_selected.push(filterRole);
		}
		else
		{
			role_selected = uniqueroles;	
		}
		
		if (filterProject != "All Projects")
		{ 
			project_selected = [];
			project_selected.push(filterProject);
		}
		else
		{
			project_selected = uniqueprojects;	
		}
		
		var sorted_empJSON = [];
		
		$.each(empJSON, function(index){
			sorted_empJSON.push(index);	
		});
			
		if (sortby != "date joined")
		{
			var temp, t;
			for (i = 0; i < sorted_empJSON.length - 1; i++)
			{
				for(j=i+1; j < sorted_empJSON.length; j++)
				{
					temp=sorted_empJSON[i];
					if (empJSON[sorted_empJSON[i]][sortby] > empJSON[sorted_empJSON[j]][sortby])
					{
						sorted_empJSON[i] = sorted_empJSON[j];
						sorted_empJSON[j] = temp;	
					}
				}
			}
		}
		
		$("#employeeDetails").html("");
		
		$.each(sorted_empJSON, function(index, val){
			if (($.inArray(empJSON[val]['role'], role_selected) > -1) && ($.inArray(empJSON[val]['currentproject'], project_selected) > -1))
			{
				
				var obj = empJSON[val];
				var empData = "<div class='empData' id='" + val + "'>";
				var empPhoto = empData + "<div class='empPhoto'><img src='" + obj.photo + "' /></div>";
				var empSlideData = empPhoto + "<div class='empSlideData'>";
				empSlideData += "<span class='name'>" + obj.name + "</span>";
				empSlideData += "<span>" + obj.role + "</span>";		
				empSlideData += "</div></div>";
				$("#employeeDetails").append(empSlideData).hide().slideDown("fast");
				
				$(".empData").unbind('click').bind("mouseenter", function(){
				//	showSlideData.apply(this);
				});
				
				$(".empData").bind("mouseleave", function(){
				//	hideSlideData.apply(this);
				});
				
				$(".empData").bind("click", function(event){
					showPopup(event);	
				});		
			}
		});
		
		
	}
	
	$("#filter_role a.sel").click(function(){
		$("#filter_role ul").toggleClass("hide");	
	});
	
	
	filterRole = function(){
		$("#filter_role a.sel").html("Showing " + this.text);
		$("#filter_role ul").addClass("hide");
		generateData();	
	}
	
	
	$("#filter_project a.sel").click(function(){
		$("#filter_project ul").toggleClass("hide");	
	});
	
	
	filterProject = function(){
		$("#filter_project a.sel").html("Showing " + this.text);
		$("#filter_project ul").addClass("hide");
		generateData();	
	}

	$(".sort_panel a.sel").click(function(){
		$(".sort_panel ul").toggleClass("hide");	
	});
	
	$(".sort_panel ul a").click(function(){	
		$(".sort_panel ul").toggleClass("hide");
		var sortOption = $(this).text();		
		$(".sort_panel a.sel").html("Sorted by " + sortOption);
		generateData();
	});
	
	showSlideData = function(){		
		$(".empSlideData", this).slideDown("fast");	
	}
	
	hideSlideData = function(){		
		$(".empSlideData", this).slideUp("fast");	
	}
	
	showPopup = function(event){
		var curEmpIndex = ($(event.target).closest(".empData").attr("id"));

        $.get('consultants/' + curEmpIndex, function(data) {
            $("#employeePopup .content").append(data);
            $("#employeePopup").css("height",document.height);
            $("#employeePopup .content_panel").css("top",scrollY + 150);
            $("#employeePopup .content_panel").css("left",$(window).width()/2 - 250);

            $("#employeePopup").fadeIn("fast");

            $(document).keydown(function(e){
                var code = e.keyCode ? e.keyCode : e.which;
                if (code == 27){
                    $(".content_panel .close").click();
                }
            });
        });
	}
	
	$(".content_panel .close").click(function(){
		$("#employeePopup").fadeOut("fast");
		$("#employeePopup .content").html("");		
	});

	
	$("#activityFeed").css("height",document.height-70);
	
	
});
