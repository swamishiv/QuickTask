
using Microsoft.EntityFrameworkCore;
using quicktaskAPI.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using MySql.Data.MySqlClient;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database
// Select database
var useAiven = builder.Configuration.GetValue<bool>("Database:UseAiven");

var connectionString = builder.Configuration.GetConnectionString(
    useAiven ? "AivenConnection" : "DefaultConnection"
);

if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException(
        "Database connection string is missing."
    );
}

// Configure Aiven SSL
if (useAiven)
{
    var connectionBuilder =
        new MySqlConnectionStringBuilder(connectionString)
        {
            SslMode = MySqlSslMode.VerifyCA,
            SslCa = Path.Combine(
                AppContext.BaseDirectory,
                "Certificates",
                "ca.pem"
            )
        };

    connectionString = connectionBuilder.ConnectionString;
}

// Configure EF Core
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySQL(connectionString)
);


// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173","https://quick-task-snowy.vercel.app")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});


// JWT Configuration
var jwtKey = builder.Configuration["Jwt:Key"];
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];

if (string.IsNullOrWhiteSpace(jwtKey))
    throw new InvalidOperationException("JWT signing key is missing.");

if (string.IsNullOrWhiteSpace(jwtIssuer))
    throw new InvalidOperationException("JWT issuer is missing.");

if (string.IsNullOrWhiteSpace(jwtAudience))
    throw new InvalidOperationException("JWT audience is missing.");

if (System.Text.Encoding.UTF8.GetByteCount(jwtKey) < 32)
    throw new InvalidOperationException(
        "JWT signing key must be at least 32 bytes.");

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtKey)),

            ClockSkew = TimeSpan.FromMinutes(1)
        };
    });


var app = builder.Build();
app.MapGet("/db-check", async (AppDbContext db) =>
{
    try
    {
        var connected = await db.Database.CanConnectAsync();

        return Results.Ok(new
        {
            Database = useAiven ? "Aiven" : "Local MySQL",
            Connected = connected
        });
    }
    catch (Exception ex)
    {
        return Results.Problem(
            title: "Database connection failed",
            detail: ex.Message
        );
    }
});

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("ReactFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapGet("/", () => Results.Redirect("/swagger"));
app.Run();
