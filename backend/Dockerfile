# =================== BASE ===================
FROM golang:1.25 AS base
WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download


# =================== DEVELOPMENT ===================
FROM base AS development
WORKDIR /app

RUN go install github.com/air-verse/air@latest

ENV PATH="/go/bin:${PATH}"

COPY . .

CMD ["air"]


# =================== PRODUCTION BUILDER ===================
FROM base AS builder

WORKDIR /app

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o main ./cmd/app


# =================== PRODUCTION RUNTIME ===================
FROM gcr.io/distroless/static:nonroot AS production

WORKDIR /app
ENV GIN_MODE=release

COPY --from=builder /app/main .

EXPOSE 8080
CMD ["./main"]
