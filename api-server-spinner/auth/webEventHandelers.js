await function handlePushEvent(event) {
    const { repository, ref } = event;

    console.log(`push event detected: ${repository} for branch ${ref}`);

    //extract context from the event
    const context = {
        gitUrl: repository.clone_url,
        branch: ref.split('/').pop(),
        repositoryName: repository.name,
    }

    //trigger workflow using context

}

module.exports = { handlePushEvent }