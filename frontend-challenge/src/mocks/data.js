export const mockSearchResponse = {
  query: "iphone",
  paging: {
    total: 1500,
    offset: 0,
    limit: 3
  },
  results: [
    {
      id: "MLA123456789",
      title: "Apple iPhone 13 (128 GB) - Medianoche",
      price: 1367999,
      currency_id: "ARS",
      condition: "new",
      thumbnail: "https://http2.mlstatic.com/D_NQ_NP_2X_897534-MLA46114829766_052021-F.webp",
      installments: {
        quantity: 12,
        amount: 113999.92
      },
      shipping: {
        free_shipping: true
      },
      reviews: {
        rating_average: 4.9,
        total: 35
      }
    },
    {
      id: "MLA987654321",
      title: "Apple iPhone 16 Pro Max 256gb",
      price: 2299000,
      currency_id: "ARS",
      condition: "new",
      thumbnail: "https://http2.mlstatic.com/D_NQ_NP_2X_647825-MLA74322737895_022024-F.webp",
      installments: {
        quantity: 12,
        amount: 191583.33
      },
      shipping: {
        free_shipping: true
      },
      reviews: {
        rating_average: 4.8,
        total: 12
      }
    },
    {
      id: "MLA555555555",
      title: "iPhone 8 64 GB Plata - Reacondicionado",
      price: 412500,
      currency_id: "ARS",
      condition: "used",
      thumbnail: "https://http2.mlstatic.com/D_NQ_NP_2X_647825-MLA28589471906_112018-F.webp",
      installments: {
        quantity: 12,
        amount: 34375
      },
      shipping: {
        free_shipping: false
      },
      reviews: {
        rating_average: 5.0,
        total: 2
      }
    }
  ]
};

export const mockProductDetail = {
  id: "MLA998877665",
  title: "Apple iPhone 16 Pro (256gb) - Nuevo - Liberado - Caja Sellada",
  price: 2509380.59,
  original_price: 3023244.99,
  currency_id: "ARS",
  available_quantity: 3,
  sold_quantity: 5,
  condition: "new",
  permalink: "https://www.mercadolibre.com.ar/p/MLA998877665",
  pictures: [
    {
      id: "1",
      url: "https://http2.mlstatic.com/D_987654-MLA0000000000_092023-I.jpg"
    },
    {
      id: "2",
      url: "https://http2.mlstatic.com/D_987655-MLA0000000001_092023-I.jpg"
    }
  ],
  installments: {
    quantity: 9,
    amount: 278820.07,
    rate: 0,
    currency_id: "ARS"
  },
  shipping: {
    free_shipping: true,
    mode: "me2",
    logistic_type: "fulfillment",
    store_pick_up: false
  },
  seller_address: {
    city: {
      name: "CABA"
    },
    state: {
      name: "Buenos Aires"
    }
  },
  attributes: [
    {
      id: "BRAND",
      name: "Marca",
      value_name: "Apple"
    },
    {
      id: "MODEL",
      name: "Modelo",
      value_name: "iPhone 16 Pro"
    },
    {
      id: "STORAGE_CAPACITY",
      name: "Capacidad de almacenamiento",
      value_name: "256 GB"
    }
  ],
  warranty: "Garantía del vendedor: 3 meses",
  description: {
    plain_text: "El iPhone 16 Pro viene con el sistema de cámaras más impresionante, para que tomes fotos espectaculares con mucha o poca luz. Y te da más tranquilidad gracias a una funcionalidad de seguridad que salva vidas."
  },
  reviews: {
    rating_average: 5.0,
    total: 1
  }
};

export const mockProductDetails = {
  MLA998877665: mockProductDetail
};


// Función para simular delay de red
export const simulateNetworkDelay = (ms = 800) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
// Porque el delay? -> Probar estados de carga y ver como se comporta la app con conexiones lentas

