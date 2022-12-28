function toggleSidebar()
{
    $('#sidebar').toggleClass('hide');
    $('#sidebar').toggleClass('show');
}

function showSidebar()
{
    const sidebar = $('#sidebar');

    if(sidebar.attr('class') !== undefined && sidebar.attr('class').split(/\s+/).includes('hide'))
    {
        sidebar.removeClass('hide');
        sidebar.addClass('show');    
    }
}

function hideSidebar()
{
    const sidebar = $('#sidebar');

    if(sidebar.attr('class') === undefined || !sidebar.attr('class').split(/\s+/).includes('hide'))
    {
        sidebar.removeClass('show');
        sidebar.addClass('hide');
    }
}

function addSidebarContent(view)
{
    const sidebarJsonPath = view.paths.sidebar;
    
    addNavbarLinks();

    $.getJSON(sidebarJsonPath, function(sidebarJson) 
    {
        const pageContentList = sidebarJson.pageContent;
        const pageContent = $('#page-content');
        
        for(const content of pageContentList)
        {
            addContentElement(pageContent, content);
        }

        if('links' in sidebarJson && sidebarJson.links.length > 0)
        {
            const linkList = sidebarJson.links;
            const divider = $('<div>').attr('name', 'divider');

            pageContent.append(divider);

            addLinks(pageContent, linkList);
        }
    });
}

function addContentElement(parentElement, content)
{
    if(Array.isArray(content.content))
    {
        const li = $('<li>');
        const a = $('<a>')
                    .attr('data-bs-toggle', 'collapse')
                    .attr('href', '#' + content.contentId)
                    .attr('role', 'button')
                    .attr('aria-expanded', 'true')
                    .attr('aria-controls', content.contentId)
                    .text(content.text);   
        
        const img = $('<img>')
                        .attr('name', 'arrow_menu')
                        .attr('src', 'components/common/assets/svg/simple-arrow.svg');

        const ul = $('<ul>')
                    .attr('id', content.contentId)
                    .addClass('collapse show list-unstyled');

        for(contentElement of content.content)
        {
            addContentElement(ul, contentElement);
        }
        
        a.append(img);
        li.append(a);
        li.append(ul);
        parentElement.append(li);
    }
    else
    {
        const li = $('<li>');
        const a = $('<a>').text(content.text);

        if('href' in content)
        {
            a.attr('href', content.href);
        }
        else
        {
            a.attr('href', '#')
             .attr('onclick', "changeContent('" + content.content + "')");
        }

        li.append(a);
        parentElement.append(li);
    }
}

function addLinks(parentElement, linkList)
{
    const li = $('<li>');
    const a = $('<a>')
                .attr('data-bs-toggle', 'collapse')
                .attr('href', '#collapse-links')
                .attr('role', 'button')
                .attr('aria-expanded', 'true')
                .attr('aria-controls', 'collapse-links')
                .text('Links');
            
    const img = $('<img>')
                    .attr('name', 'arrow_menu')
                    .attr('src', 'components/common/assets/svg/simple-arrow.svg');
    
    const ul = $('<ul>')
                .attr('id', 'collapse-links')  
                .addClass('collapse show list-unstyled'); 

    for(const link of linkList)
    {
        addContentElement(ul, link);
    }

    a.append(img);
    li.append(a);
    li.append(ul);
    parentElement.append(li);
}

function addNavbarLinks() //add navbar links to sidebar
{ 
    const ul = $('#sidebar-navlinks-ul');

    $('#navbar-navlinks > a').each(function ()
    {
        const a = $('<a>')
                    .attr('href', $(this).attr('href'))
                    .attr('onclick', $(this).attr('onclick'))
                    .text($(this).text());

        const li = $('<li>');

        li.append(a);
        ul.append(li);
    });
}

function filterMenus()
{
    const searchedText = $('#searchbar').val();
    
    $('#page-content [href="#"], #collapse-links a').each(function() 
    {
        if ($(this).text().toLowerCase().search(searchedText.toLowerCase()) > -1) 
        {
            $(this).show();

            $('[href="#' + this.parentElement.parentElement.id + '"]').each(function()
            {
                if($(this).attr('aria-expanded') === 'false')
                {
                    this.click();
                }
            });
        }
        else 
        {
            $(this).hide();
        }
    });
}