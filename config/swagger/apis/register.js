module.exports = {
  '/register/all': {
    get: {
      tags: ['registration'],
      summary: 'student view all course reservations',
      description: '學生檢視所有課程預約',
      security: [
        {
          bearerAuth: []
        }
      ],
      parameters: [
        {
          name: 'keyword',
          in: 'query',
          schema: {
            type: 'string'
          }
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
                      registeredCourses: {
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
                                  type: 'object',
                                  properties: {
                                    name: {
                                      type: 'string',
                                      example: 'testing'
                                    },
                                    category: {
                                      type: 'array',
                                      items: {
                                        type: 'string',
                                        example: '多益'
                                      }
                                    },
                                    intro: {
                                      type: 'string',
                                      example: 'testing'
                                    },
                                    link: {
                                      type: 'string',
                                      example: 'https://example.com'
                                    },
                                    image: {
                                      type: 'string',
                                      example: 'https://example.com'
                                    },
                                    duration: {
                                      type: 'integer',
                                      example: 30
                                    },
                                    startAt: {
                                      type: 'string',
                                      example: '2024-03-09 10:02:41'
                                    },
                                    teacherId: {
                                      type: 'integer',
                                      example: 1
                                    },
                                    User: {
                                      type: 'object',
                                      properties: {
                                        id: {
                                          type: 'integer',
                                          example: 1
                                        },
                                        name: {
                                          type: 'string',
                                          example: 'test'
                                        }
                                      }
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
                }
              }
            }
          }
        }
      }
    }
  },
  '/register/{courseId}': {
    get: {
      tags: ['registration'],
      summary: 'teacher view course reservations',
      description: '老師檢視課程所有預約',
      security: [
        {
          bearerAuth: []
        }
      ],
      parameters: [
        {
          name: 'courseId',
          in: 'path',
          description: 'course id',
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
                                  example: 'user-1'
                                },
                                email: {
                                  type: 'string',
                                  example: 'test@569'
                                },
                                nickname: {
                                  type: 'string',
                                  example: 'testing'
                                },
                                avatar: {
                                  type: 'string',
                                  example: 'https://example.com'
                                }
                              }
                            },
                            Course: {
                              type: 'object',
                              properties: {
                                name: {
                                  type: 'string',
                                  example: 'testing'
                                },
                                category: {
                                  type: 'array',
                                  items: {
                                    type: 'string',
                                    example: '多益'
                                  }
                                },
                                link: {
                                  type: 'string',
                                  example: 'https://example.com'
                                },
                                teacherId: {
                                  type: 'integer',
                                  example: 1
                                },
                                startAt: {
                                  type: 'string',
                                  example: '2024-03-09 10:02:41'
                                },
                                duration: {
                                  type: 'integer',
                                  example: 30
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
            }
          }
        },
        403: {
          description: 'Forbidden',
          content: {
            'application/json': {}
          }
        }
      }
    },
    post: {
      tags: ['registration'],
      summary: 'register the course',
      description: '學生預約課程',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              example: {
                courseId: 114
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
          description: 'course id',
          schema: {
            type: 'integer'
          },
          required: true,
          example: '114'
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
                        example: 1
                      },
                      studentId: {
                        type: 'integer',
                        example: 1
                      },
                      courseId: {
                        type: 'integer',
                        example: 1
                      },
                      updatedAt: {
                        type: 'string',
                        example: '2024-03-09 10:02:41'
                      },
                      createdAt: {
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
    },
    put: {
      tags: ['registration'],
      summary: 'student comment and rate for the course',
      description: '學生對課程評分及評論',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              example: {
                studentId: 1,
                courseId: 114,
                comment: '123',
                rating: 4
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
          description: 'course id',
          schema: {
            type: 'integer'
          },
          required: true,
          example: '114'
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
                        example: 1
                      },
                      courseId: {
                        type: 'integer',
                        example: 1
                      },
                      studentId: {
                        type: 'integer',
                        example: 1
                      },
                      rating: {
                        type: 'integer',
                        example: 1
                      },
                      comment: {
                        type: 'string',
                        example: 'testing'
                      },
                      createdAt: {
                        type: 'string',
                        example: '2024-03-09 10:02:41'
                      },
                      updatedAt: {
                        type: 'string',
                        example: '2024-03-09 10:02:41'
                      },
                      Course: {
                        type: 'object',
                        properties: {
                          startAt: {
                            type: 'string',
                            example: '2024-03-09 10:02:41'
                          }
                        }
                      }
                    }
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
        }
      }
    },
    delete: {
      tags: ['registration'],
      summary: 'student cancel the course reservation',
      description: '學生取消課程預約',
      security: [
        {
          bearerAuth: []
        }
      ],
      parameters: [
        {
          name: 'courseId',
          in: 'path',
          description: 'course id',
          schema: {
            type: 'integer'
          },
          required: true,
          example: '114'
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
                        example: 1
                      },
                      courseId: {
                        type: 'integer',
                        example: 1
                      },
                      studentId: {
                        type: 'integer',
                        example: 1
                      },
                      rating: {
                        type: 'integer',
                        example: 1
                      },
                      comment: {
                        type: 'string',
                        example: 'testing'
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
        404: {
          description: 'Not Found',
          content: {
            'application/json': {}
          }
        }
      }
    }
  }
}
