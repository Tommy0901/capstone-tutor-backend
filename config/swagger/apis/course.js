module.exports = {
  '/course/{courseId}': {
    get: {
      tags: ['course'],
      summary: '檢視課程頁面',
      security: [
        {
          bearerAuth: []
        }
      ],
      parameters: [
        {
          name: 'courseId',
          in: 'path',
          description: '請輸入欲檢視的課程 id',
          schema: {
            type: 'integer'
          },
          required: true
        }
      ],
      responses: {
        200: {
          description: 'ok',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    example: 'success'
                  },
                  data: {
                    allOf: [
                      {
                        $ref: '#/components/schemas/Course'
                      },
                      {
                        type: 'object',
                        properties: {
                          Registrations: {
                            type: 'array',
                            items: {
                              allOf: [
                                {
                                  $ref: '#/components/schemas/Registration'
                                },
                                {
                                  type: 'object',
                                  properties: {
                                    User: {
                                      type: 'object',
                                      properties: {
                                        id: {
                                          type: 'integer',
                                          example: 1
                                        },
                                        name: {
                                          type: 'string',
                                          example: 'jfs'
                                        }
                                      }
                                    }
                                  }
                                }
                              ]
                            }
                          }
                        }
                      }
                    ]
                  }
                }
              }
            }
          }
        },
        404: {
          description: 'Not Found',
          content: {
            'application/json': {}
          }
        }
      }
    },
    put: {
      tags: ['course'],
      summary: '老師修改課程資料',
      description: '可編輯欄位包含 category(陣列), name, intro, link, duration, image, startAt 其中 category(陣列), name, intro, link, duration 跟 startAt 為必填',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              example: {
                teacherId: 11,
                category: [3],
                name: 'test2',
                intro: '123',
                link: 'https://naughty-laborer.info/',
                duration: 30,
                startAt: '2024-03-08 19:30:00'
              }
            }
          }
        }
      },
      security: [
        {
          bearerAuth: []
        }
      ],
      parameters: [
        {
          name: 'courseId',
          in: 'path',
          description: '請輸入欲修改的課程 id',
          schema: {
            type: 'integer'
          },
          required: true
        }
      ],
      responses: {
        200: {
          description: 'ok',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    example: 'success'
                  },
                  data: {
                    $ref: '#/components/schemas/Course'
                  }
                }
              }
            }
          }
        },
        400: {
          description: 'Bad Request',
          content: {
            'application/json': {}
          }
        },
        403: {
          description: 'Forbidden',
          content: {
            'application/json': {}
          }
        },
        404: {
          description: 'Not Found',
          content: {
            'application/json': {}
          }
        }
      }
    }
  },
  '/course': {
    post: {
      tags: ['course'],
      summary: '老師建立課程',
      description: '欄位 category(陣列), name, intro, link, duration 跟 startAt 為必填',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              example: {
                teacherId: 11,
                category: [3],
                name: 'test2',
                intro: '123',
                link: 'https://naughty-laborer.info/',
                duration: 30,
                startAt: '2024-03-08 19:30:00'
              }
            }
          }
        }
      },
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
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    example: 'success'
                  },
                  data: {
                    $ref: '#/components/schemas/Course'
                  }
                }
              }
            }
          }
        },
        400: {
          description: 'Bad Request',
          content: {
            'application/json': {}
          }
        },
        403: {
          description: 'Forbidden',
          content: {
            'application/json': {}
          }
        }
      }
    }
  }
}
