module.exports = {
  '/admin/users': {
    get: {
      tags: ['admin'],
      summary: 'admin browse user list',
      description: '進入後台查看使用者清單',
      security: [
        {
          bearerAuth: []
        }
      ],
      responses: {
        200: {
          description: 'ok',
          content: {
            'application/json': {
              schema: {
                type: 'object'
              },
              example: {
                status: 'success',
                data: [
                  {
                    id: 1,
                    name: 'user-1',
                    isTeacher: 0
                  }
                ]
              }
            }
          }
        },
        403: {
          description: 'Forbidden',
          content: {
            'application/json': {}
          }
        },
        500: {
          description: 'Internal Server Error',
          content: {
            'application/json': {}
          }
        }
      }
    }
  }
}
