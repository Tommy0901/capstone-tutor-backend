module.exports = {
  '/login/facebook': {
    get: {
      tags: ['OAuth'],
      summary: 'Facebook OAuth login page',
      description: '顯示Facebook OAuth登入頁',
      responses: {
        200: {
          description: 'ok',
          content: {
            'application/json': {}
          }
        }
      }
    }
  },
  '/oauth/redirect/facebook': {
    get: {
      tags: ['OAuth'],
      summary: 'Facebook authenticate and redirect',
      description: 'Facebook驗證成功後，可進入家教平台首頁',
      security: [
        {
          OAuth: []
        }
      ],
      responses: {
        200: {
          description: 'ok',
          content: {
            'application/json': {}
          }
        },
        401: {
          description: 'Unauthorized',
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
  },
  '/login/google': {
    get: {
      tags: ['OAuth'],
      summary: 'Google OAuth login page',
      description: '顯示Google OAuth登入頁',
      responses: {
        200: {
          description: 'ok',
          content: {
            'application/json': {}
          }
        }
      }
    }
  },
  '/oauth/redirect/google': {
    get: {
      tags: ['OAuth'],
      summary: 'Google authenticate and redirect',
      description: 'Google驗證成功後，可進入家教平台首頁',
      security: [
        {
          OAuth: []
        }
      ],
      responses: {
        200: {
          description: 'ok',
          content: {
            'application/json': {}
          }
        },
        401: {
          description: 'Unauthorized',
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
