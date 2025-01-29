function searchHelp() {
    echo("You can do a little search with duckduckgo. To use it, use the search command");
}

async function search(query) {
    if (!query.trim()) return;

    try {
        const response = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`);
        const data = await response.json();
        const results = data.RelatedTopics.map(topic => 
            topic.FirstURL && topic.Text ? `<a href="${topic.FirstURL}">${topic.Text}</a><br>` : ''
        ).filter(item => item).join("\n");
        
        echo(results);
    } catch (error) {
        echo("Error fetching results.");
    }
}