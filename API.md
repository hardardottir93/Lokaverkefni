# API Documentation – Tix API

Dæmi þar sem Postman er notað til að sækja/skila gögnum:

## Base URL
- Local: `http://localhost:3000`

Dæmi:
- `GET http://localhost:3000/events`

---


## Endapunktar

## Events - UC1 og UC2

### GET /events
Sýnir lista af viðburðum og tómum lista ef enginn viðburður er til staðar.

**Response**
- `200`
```json
{
    "count": 2,
    "events": [
        {
            "id": 1,
            "name": "Test Event",
            "description": null,
            "event_date": "2030-01-01T00:00:00.000Z",
            "available_tickets": 100,
            "ticket_cost": 5000,
            "venue_id": 1,
            "category_id": 1,
            "created_at": "2026-01-07T11:57:04.283Z"
        },
        {
            "id": 2,
            "name": "Test Event <24h",
            "description": null,
            "event_date": "2026-01-07T23:57:04.283Z",
            "available_tickets": 100,
            "ticket_cost": 5000,
            "venue_id": 1,
            "category_id": 1,
            "created_at": "2026-01-07T11:57:04.283Z"
        }
    ]
}
```

---

### GET /events/:id
Nær í stakann viðburð og skilar upplýsingum.

**Params**
- `id` 

**Response**
- `200`
```json
{
    "id": 1,
    "name": "Test Event",
    "description": null,
    "event_date": "2030-01-01T00:00:00.000Z",
    "category": "Tónleikar",
    "venue": "Harpa",
    "available_tickets": 100,
    "ticket_cost": 5000
}
```

**Errors**
- `404` ef viðburður finnst ekki

---

## Venues - UC3

### GET /venues
Sýnir alla staði í gagnagrunnni og tóman lista ef enginn er til staðar.

**Response**
- `200`
```json
{
    "count": 2,
    "venues": [
        {
            "id": 2,
            "name": "Borgarleikhúsið",
            "address": "Reykjavík",
            "capacity": 900
        },
        {
            "id": 1,
            "name": "Harpa",
            "address": "Reykjavík",
            "capacity": 1800
        }
    ]
}
```

---

### GET /venues/:id
Sýnir valinn stað og lista af öllum viðburðum á þeim stað.

**Params**
- `id` 

**Response**
- `200`
```json
{
    "id": 1,
    "name": "Harpa",
    "address": "Reykjavík",
    "capacity": 1800,
    "events": [
        {
            "id": 2,
            "name": "Test Event <24h",
            "event_date": "2026-01-07T23:57:04.283Z",
            "category": "Tónleikar"
        },
        {
            "id": 1,
            "name": "Test Event",
            "event_date": "2030-01-01T00:00:00.000Z",
            "category": "Tónleikar"
        }
    ]
}
```

**Errors**
- `404` ef viðburðastaður fannst ekki

---


## Auth - UC4 og UC5

### POST /auth/signup
Býr til notanda.

**Body**
```json
{
  "name": "Joe",
  "email": "joe@example.com",
  "password": "strongPassword123"
}
```

**Responses**
- `201`  
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "Joe",
    "email": "joe@example.com"
  }
}
```

**Errors**
- `400` ef netfang er þegar til, lykilorð er of stutt eða gögn vantar.

---

### POST /auth/login
Innskráning – skilar token.

**Body**
```json
{
  "email": "joe@example.com",
  "password": "strongPassword123"
}
```

**Response**
- `200`
```json
{
  "token": "<jwt>",
  "message": "Innskráning tókst."
}
```

**Errors**
- `401` ef lykilorð eða netfang er ekki rétt

---
## Bookings - UC6, UC7 og UC8

### POST /bookings
Býr til bókun/kaup á miðum fyrir viðburð fyrir innskráðan notanda.

**Auth:** - Staðfest

**Body**
```json
{
  "eventId": 1,
  "quantity": 2,
  "paymentMethod": "APPLE_PAY"
}
```

**Response**
- `201`
```json
{
    "bookingId": 3
}

```

**Error**
- `404` ef viðburður finnst ekki
- `400` ef ekki nóg af miðum 

---

### GET /bookings/my
Sýnir bókannir fyrir innskráðan notanda.

**Auth:** - Staðfest

**Response**
- `200`
```json
[
    {
        "booking_id": 3,
        "quantity": 2,
        "total_price": 10000,
        "event": {
            "id": 2,
            "name": "Test Event <24h",
            "date": "2026-01-07T23:57:04.283Z"
        }
    }
]
```

**Error**
- `401` ef notandi er ekki innskráður

---

### DELETE /bookings/:id
Afbókar bókun frá notanda og skilar miðum í gagnagrunn.

**Auth:** - Staðfest

**Skilyrði**
- Ekki má afbóka ef minna en 24 klst eru í viðburð.

**Params**
- `id` 

**Response**
- `200`
```json
{
    "message": "Bókun hefur verið afpöntuð"
}
```

**Errors**
- `400` ef styttra en 24 tímar eru í viðburð
- `404` ef bókun finnst ekki
- `403` ef bókun tilheyrir ekki notanda


## Users - UC9 og UC10

### PATCH /users/update
Uppfærir prófíl hjá innskráðu notanda (t.d. nafn, email, password).

**Auth:** - Staðfest

**Body**
```json
{
  "name": "Gunna"
}
```

**Response**
- `200`
```json
{
    "success": true,
    "user": {
        "id": 2,
        "name": "Gunna",
        "email": "joe@example.is",
        "created_at": "2026-01-07T12:25:33.536Z",
        "updated_at": "2026-01-07T12:33:16.340Z"
    }
}
```

**Errors**
- `400` ef upplýsingar í body
- `401` ef token er ekki réttur
---

### DELETE /users/delete
Eyðir aðgangi.

**Auth:** - Staðfest

**Response**
- `200`
```json
{
    "success": true,
    "message": "Aðgangi eytt"
}
```
**Errors**
- `404` ef notandi finnst ekki

---


