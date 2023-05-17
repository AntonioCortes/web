let constants = null;
const mainView = 'angular';

$(document).ready(function () 
{
	$.getJSON("assets/constants.json", function (json) 
	{
		constants = json;

		$('#navbar').load(constants.common.paths.navbar, function()
		{
			changeView(mainView);
		});
	});
});

function getConstant(constantKey)
{
	const splittedConstantKey = constantKey.split('.');
	
	let constant = constants;
	for(const key of splittedConstantKey)
	{
		constant = constant[key];
	}

	return constant;
}

function changeContent(contentKey)
{
	const component = getConstant(contentKey)
	if('css' in component)
	{
		$('#component-css').attr('href', component.basePath + '/' + component.css);
	}
	else
	{
		$('#component-css').attr('href', '');
	}

	$('#content').load(component.basePath + '/' + component.html, function()
	{
		$('[data-bs-toggle="tooltip"]').tooltip();  
		addCodeLineNumbers();

		setTimeout(function () 
		{
			hljs.highlightAll();

			const options = {
				copyIconClass: "bi bi-files",
				checkIconClass: "bi bi-check-lg text-success",
			};
			window.highlightJsBadge(options);
		}, 10);

		if("js" in component)
		{
			$.getScript(component.basePath + '/' + component.js);
		}
	});
}

function addCodeLineNumbers()
{
	$.each($('code'), function() {
		this.innerHTML = this.innerHTML.trim();

		const lineCount = this.innerHTML.match(/[^\n]*\n[^\n]*/gi).length
		
		const div = document.createElement('div');
		div.classList.add('hljs');
		div.classList.add('padding-14');

		for(var i = 1; i < lineCount + 2; i++)
		{
			const div2 = document.createElement('div');

			div2.innerText = i;
			div.appendChild(div2);
		}

		this.parentElement.insertBefore(div, this);
	});
}

function changeView(viewKey) 
{
	const view = getConstant(viewKey);
	$('#nav-topic').text(view.topic);

	if('logo' in view.paths)
	{
		$('#logo').attr('src', view.paths.logo);
	}	 

	if(window.innerWidth <= 992)
	{
		hideSidebar();
	}

	$('#sidebar').load(constants.common.paths.sidebar, function()
	{
		window.onresize = function ()
		{
			if(window.innerWidth <= 992)
			{
				hideSidebar();
			}
			else
			{
				showSidebar();
			}
		}

		$('#content').click(function ()
		{
			if(window.innerWidth <= 992)
			{
				hideSidebar();
			}
		});

		$('#sidebar-header').text(view.topic);
		addSidebarContent(view);
	});

	changeContent(viewKey + '.paths.' + view.mainContent);
}


// ===Change Theme===
function changeTheme(){	
	// Default Style Paths
	const defaultStylePathNav = "css/navbar.css";
	const defaultStylePathContent = "css/content.css";
	const defaultStylePathSidebar = "css/sidebar.css";
	const defaultStylePathGeneral = "css/general-style.css";

	// Dark Style Paths
	const darkStylePathNav = "css/dark-theme/navbar.css";
	const darkStylePathContent = "css/dark-theme/content.css";
	const darkStylePathSidebar = "css/dark-theme/sidebar.css";
	const darkStylePathGeneral = "css/dark-theme/general-style.css";


	if($('#themeButton').attr("status") == "light-theme"){
		$('#navbarTheme').attr("href",darkStylePathNav)
		$('#contentTheme').attr("href",darkStylePathContent)
		$('#sidebarTheme').attr("href",darkStylePathSidebar)
		$('#generalStyleTheme').attr("href",darkStylePathGeneral)

		$('#themeButton').attr("status","dark-theme")
	}else if($('#themeButton').attr("status") == "dark-theme"){
		$('#navbarTheme').attr("href",defaultStylePathNav)
		$('#contentTheme').attr("href",defaultStylePathContent)
		$('#sidebarTheme').attr("href",defaultStylePathSidebar)
		$('#generalStyleTheme').attr("href",defaultStylePathGeneral)

		$('#themeButton').attr("status","light-theme")
	}
}
// ================