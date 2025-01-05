async function handlePushEvent(event) {
    const { repository, ref } = event.body;

    console.log(`Push event detected`);
    console.log("Event object:", event.body);

    // Extract context from the event
    const context = {
        gitUrl: repository.clone_url,        // Repository's clone URL
        branch: ref.split('/').pop(),        // Extract branch name from ref (e.g., refs/heads/main -> main)
        repositoryName: repository.name,     // Repository name
    }

    console.log("Extracted context:", context);
}

module.exports = { handlePushEvent }