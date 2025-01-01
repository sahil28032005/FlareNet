//mock test
it("should validate and parse request correctly", async () => {
    const req = {
        body: {
          projectId:"123e4567-e89b-12d3-a456-426614174000",
          environment:"DEV",
        }
    };

    const res = { json: jest.fn(), status: jest.fn().mockReturnThis(), send: jest.fn() };

    const mockProject = { id: "123e4567-e89b-12d3-a456-426614174000", name: "Test Project" };
    prisma.project.findUnique = jest.fn().mockResolvedValue(mockProject);
    prisma.deployment.create = jest.fn().mockResolvedValue({
        id: "deployment-id",
        projectId: req.body.projectId,
        url: `http://${req.body.projectId}.localhost:9000`,
        environment: req.body.environment,
        status: "INACTIVE",
        version: "v1.0.0",
    });
    buildQueue.add = jest.fn();

    await app.post("/deploy", req, res);

    expect(prisma.project.findUnique).toHaveBeenCalledWith({
        where: { id: req.body.projectId },
    });
    expect(prisma.deployment.create).toHaveBeenCalled();
    expect(buildQueue.add).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
        status: "queued",
        data: { deploymentId: "deployment-id", domain: `http://${req.body.projectId}.localhost:9000` },
    });
});