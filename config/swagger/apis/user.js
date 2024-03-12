module.exports = {
  '/signup': {
    post: {
      tags: ['user'],
      summary: 'sign up the user',
      description: '新增使用者註冊資料',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              example: {
                name: 'test',
                email: 'test@567',
                password: '123',
                passwordCheck: '123'
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'ok',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/signup'
              }
            }
          }
        },
        401: {
          description: 'Unauthorized',
          content: {
            'application/json': {}
          }
        }
      }
    }
  },
  '/signin': {
    post: {
      tags: ['user'],
      summary: 'user sign in',
      description: '送出使用者登入資料',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              example: {
                email: 'user1@example.com',
                password: '12345678'
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'ok',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/signin'
              }
            }
          }
        },
        401: {
          description: 'Unauthorized',
          content: {
            'application/json': {}
          }
        }
      }
    }
  },
  '/home': {
    get: {
      tags: ['user'],
      summary: 'browse the home page',
      description: '顯示所有老師資料與學生的學習時數排名',
      responses: {
        200: {
          description: 'ok',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/home'
              }
            }
          }
        }
      }
    }
  },
  '/student/{id}/edit': {
    get: {
      tags: ['user'],
      summary: 'browse student edit page',
      description: '學生進入個人編輯頁',
      security: [
        {
          bearerAuth: []
        }
      ],
      parameters: [
        {
          name: 'id',
          in: 'path',
          description: 'student id',
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
                        $ref: '#/components/schemas/Student'
                      },
                      {
                        type: 'object',
                        properties: {
                          createdAt: {
                            type: 'string',
                            example: '2024-03-09 10:02:41'
                          },
                          updatedAt: {
                            type: 'string',
                            example: '2024-03-09 10:02:41'
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
  },
  '/student/{id}': {
    put: {
      tags: ['user'],
      summary: 'update student data',
      description: '學生修改個人頁面',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              example: {
                name: 'test',
                nickname: 'testing',
                avatar: 'https://loremflickr.com/320/240/people/all',
                selfIntro: 'test tset'
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
          name: 'id',
          in: 'path',
          description: 'student id',
          schema: {
            type: 'integer'
          },
          required: true,
          example: '1'
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
                        $ref: '#/components/schemas/Student'
                      },
                      {
                        type: 'object',
                        properties: {
                          createdAt: {
                            type: 'string',
                            example: '2024-03-09 10:02:41'
                          },
                          updatedAt: {
                            type: 'string',
                            example: '2024-03-09 10:02:41'
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
        401: {
          description: 'Unauthorized',
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
        500: {
          description: 'Internal Server Error',
          content: {
            'application/json': {}
          }
        }
      }
    },
    get: {
      tags: ['user'],
      summary: 'browse student psersonal page',
      description: '學生瀏覽自己的個人頁面',
      security: [
        {
          bearerAuth: []
        }
      ],
      parameters: [
        {
          name: 'id',
          in: 'path',
          description: 'student id',
          schema: {
            type: 'integer'
          },
          required: true,
          example: '2'
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
                        $ref: '#/components/schemas/Student'
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
                                    Course: {
                                      $ref: '#/components/schemas/Course'
                                    }
                                  }
                                }
                              ]
                            }
                          },
                          studyRank: {
                            type: 'integer',
                            example: 9
                          },
                          studyHours: {
                            type: 'string',
                            example: '330'
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
  '/teacher/{id}/personal': {
    get: {
      tags: ['user'],
      summary: 'teacher browse self page',
      description: '老師瀏覽自己的個人頁面',
      security: [
        {
          bearerAuth: []
        }
      ],
      parameters: [
        {
          name: 'id',
          in: 'path',
          description: 'teacher id',
          schema: {
            type: 'integer'
          },
          required: true,
          example: '11'
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
                        $ref: '#/components/schemas/Teacher'
                      },
                      {
                        type: 'object',
                        properties: {
                          email: {
                            type: 'string',
                            example: 'user1@example.com'
                          },
                          mon: {
                            type: 'boolean',
                            example: true
                          },
                          tue: {
                            type: 'boolean',
                            example: true
                          },
                          wed: {
                            type: 'boolean',
                            example: true
                          },
                          thu: {
                            type: 'boolean',
                            example: true
                          },
                          fri: {
                            type: 'boolean',
                            example: true
                          },
                          sat: {
                            type: 'boolean',
                            example: true
                          },
                          sun: {
                            type: 'boolean',
                            example: true
                          },
                          teaching_categories: {
                            type: 'array',
                            items: {
                              allOf: [
                                {
                                  $ref: '#/components/schemas/Teaching_category'
                                },
                                {
                                  type: 'object',
                                  properties: {
                                    Category: {
                                      type: 'object',
                                      properties: {
                                        name: {
                                          type: 'string',
                                          example: '多益'
                                        }
                                      }
                                    }
                                  }
                                }
                              ]
                            }
                          },
                          Courses: {
                            type: 'array',
                            items: {
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
                                        type: 'object',
                                        properties: {
                                          rating: {
                                            type: 'integer',
                                            example: 5
                                          },
                                          comment: {
                                            type: 'string',
                                            example: 'test'
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              ]
                            }
                          },
                          ratingAverage: {
                            type: 'number',
                            example: 2.6
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
  '/teacher/{id}/edit': {
    get: {
      tags: ['user'],
      summary: 'browse teacher personal edit page',
      description: '老師進入個人編輯頁',
      security: [
        {
          bearerAuth: []
        }
      ],
      parameters: [
        {
          name: 'id',
          in: 'path',
          description: 'teacher id',
          schema: {
            type: 'integer'
          },
          required: true,
          example: '11'
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
                        $ref: '#/components/schemas/Teacher'
                      },
                      {
                        type: 'object',
                        properties: {
                          email: {
                            type: 'string',
                            example: 'user1@example.com'
                          },
                          mon: {
                            type: 'boolean',
                            example: true
                          },
                          tue: {
                            type: 'boolean',
                            example: true
                          },
                          wed: {
                            type: 'boolean',
                            example: true
                          },
                          thu: {
                            type: 'boolean',
                            example: true
                          },
                          fri: {
                            type: 'boolean',
                            example: true
                          },
                          sat: {
                            type: 'boolean',
                            example: true
                          },
                          sun: {
                            type: 'boolean',
                            example: true
                          },
                          createdAt: {
                            type: 'string',
                            example: '2024-03-09 10:02:41'
                          },
                          updatedAt: {
                            type: 'string',
                            example: '2024-03-09 10:02:41'
                          },
                          teaching_categories: {
                            type: 'array',
                            items: {
                              allOf: [
                                {
                                  $ref: '#/components/schemas/Teaching_category'
                                },
                                {
                                  type: 'object',
                                  properties: {
                                    Category: {
                                      type: 'object',
                                      properties: {
                                        name: {
                                          type: 'string',
                                          example: '多益'
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
  },
  '/teacher/{id}': {
    put: {
      tags: ['user'],
      summary: 'update teacher personal page',
      description: '老師修改個人頁面',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              example: {
                name: 'teacher-1',
                nation: 'Bulgaria',
                nickname: 'calco',
                teachStyle: 'Veritatis thermae corrupti amissio arcus desparatus ulterius audeo harum. Rem versus cruentus tricesimus adinventitias delinquo tenuis mollitia perferendis. Quisquam decretum traho.',
                category: [1],
                email: 'teacher1@example.com',
                password: '12345678',
                mon: 'true',
                tue: 'false',
                wed: 'true',
                thu: 'false',
                fri: 'true',
                sat: 'false',
                sun: 'true'
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
          name: 'id',
          in: 'path',
          description: 'teacher id',
          schema: {
            type: 'integer'
          },
          required: true,
          example: '11'
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
                        $ref: '#/components/schemas/Teacher'
                      },
                      {
                        type: 'object',
                        properties: {
                          mon: {
                            type: 'boolean',
                            example: true
                          },
                          tue: {
                            type: 'boolean',
                            example: true
                          },
                          wed: {
                            type: 'boolean',
                            example: true
                          },
                          thu: {
                            type: 'boolean',
                            example: true
                          },
                          fri: {
                            type: 'boolean',
                            example: true
                          },
                          sat: {
                            type: 'boolean',
                            example: true
                          },
                          sun: {
                            type: 'boolean',
                            example: true
                          },
                          createdAt: {
                            type: 'string',
                            example: '2024-03-09 10:02:41'
                          },
                          updatedAt: {
                            type: 'string',
                            example: '2024-03-09 10:02:41'
                          },
                          category: {
                            type: 'array',
                            items: {
                              type: 'string',
                              example: '多益'
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
        401: {
          description: 'Unauthorized',
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
        500: {
          description: 'Internal Server Error',
          content: {
            'application/json': {}
          }
        }
      }
    },
    patch: {
      tags: ['user'],
      summary: 'become a teacher',
      description: '申請成為老師',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              example: {
                isTeacher: 'True'
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
          name: 'id',
          in: 'path',
          description: 'teacher id',
          schema: {
            type: 'integer'
          },
          required: true,
          example: '1'
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
                    type: 'object',
                    properties: {
                      id: {
                        type: 'integer',
                        example: 46
                      },
                      name: {
                        type: 'string',
                        example: 'test'
                      },
                      email: {
                        type: 'string',
                        example: 'test@569'
                      },
                      isTeacher: {
                        type: 'boolean',
                        example: 1
                      },
                      createdAt: {
                        type: 'string',
                        example: '2024-03-09 10:02:41'
                      },
                      updatedAt: {
                        type: 'string',
                        example: '2024-03-09 10:02:41'
                      }
                    }
                  }
                }
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
    },
    get: {
      tags: ['user'],
      summary: 'student browse teacher personal page',
      description: '學生瀏覽老師的個人頁面',
      parameters: [
        {
          name: 'id',
          in: 'path',
          description: 'teacher id',
          schema: {
            type: 'string'
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
                        $ref: '#/components/schemas/Teacher'
                      },
                      {
                        type: 'object',
                        properties: {
                          email: {
                            type: 'string',
                            example: 'user1@example.com'
                          },
                          mon: {
                            type: 'boolean',
                            example: true
                          },
                          tue: {
                            type: 'boolean',
                            example: true
                          },
                          wed: {
                            type: 'boolean',
                            example: true
                          },
                          thu: {
                            type: 'boolean',
                            example: true
                          },
                          fri: {
                            type: 'boolean',
                            example: true
                          },
                          sat: {
                            type: 'boolean',
                            example: true
                          },
                          sun: {
                            type: 'boolean',
                            example: true
                          },
                          createdAt: {
                            type: 'string',
                            example: '2024-03-09 10:02:41'
                          },
                          updatedAt: {
                            type: 'string',
                            example: '2024-03-09 10:02:41'
                          },
                          teaching_categories: {
                            type: 'array',
                            items: {
                              allOf: [
                                {
                                  $ref: '#/components/schemas/Teaching_category'
                                },
                                {
                                  type: 'object',
                                  properties: {
                                    Category: {
                                      type: 'object',
                                      properties: {
                                        name: {
                                          type: 'string',
                                          example: '多益'
                                        }
                                      }
                                    }
                                  }
                                }
                              ]
                            }
                          },
                          Courses: {
                            type: 'array',
                            items: {
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
                                        type: 'object',
                                        properties: {
                                          rating: {
                                            type: 'integer',
                                            example: 4
                                          },
                                          comment: {
                                            type: 'string',
                                            example: 'example'
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              ]
                            }
                          },
                          ratingAverage: {
                            type: 'string',
                            example: 2.6
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
